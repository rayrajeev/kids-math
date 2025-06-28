import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Question, GameState } from "@shared/schema";

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentQuestion: null,
    timeLeft: 5,
    isPlaying: false,
    correctCount: 0,
    totalQuestions: 0,
    gameStarted: false,
  });

  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch high score
  const { data: highScoreData } = useQuery({
    queryKey: ["/api/high-score"],
  });

  // Save game stats mutation
  const saveStatsMutation = useMutation({
    mutationFn: async (stats: { score: number; correctAnswers: number; totalQuestions: number }) => {
      const response = await apiRequest("POST", "/api/game-stats", stats);
      return response.json();
    },
  });

  // Generate random addition question
  const generateQuestion = useCallback((): Question => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const correctAnswer = num1 + num2;
    
    // Generate wrong answer (different from correct)
    let wrongAnswer;
    do {
      wrongAnswer = Math.floor(Math.random() * 19); // 0-18 range for single digit addition
    } while (wrongAnswer === correctAnswer);

    // Randomly decide which position gets the correct answer
    const correctIndex = Math.random() < 0.5 ? 0 : 1;
    const options = [wrongAnswer, wrongAnswer];
    options[correctIndex] = correctAnswer;

    return {
      display: `${num1} + ${num2} = ?`,
      num1,
      num2,
      correctAnswer,
      options,
      correctIndex,
    };
  }, []);

  // Start new question
  const startNewQuestion = useCallback(() => {
    const newQuestion = generateQuestion();
    setGameState(prev => ({
      ...prev,
      currentQuestion: newQuestion,
      timeLeft: 5,
      totalQuestions: prev.totalQuestions + 1,
    }));
  }, [generateQuestion]);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    setTimerInterval(interval);
  }, [timerInterval]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  // Handle answer selection
  const selectAnswer = useCallback((selectedAnswer: number) => {
    stopTimer();
    
    if (!gameState.currentQuestion) return;

    const isCorrect = selectedAnswer === gameState.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10,
        correctCount: prev.correctCount + 1,
      }));
    }

    return isCorrect;
  }, [gameState.currentQuestion, stopTimer]);

  // Start game
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameStarted: true,
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
    }));
    startNewQuestion();
  }, [startNewQuestion]);

  // End game
  const endGame = useCallback(() => {
    stopTimer();
    setGameState(prev => ({ ...prev, isPlaying: false }));
    
    // Save game stats
    if (gameState.totalQuestions > 0) {
      saveStatsMutation.mutate({
        score: gameState.score,
        correctAnswers: gameState.correctCount,
        totalQuestions: gameState.totalQuestions,
      });
    }
  }, [gameState.score, gameState.correctCount, gameState.totalQuestions, stopTimer, saveStatsMutation]);

  // Auto-start timer when new question is set
  useEffect(() => {
    if (gameState.currentQuestion && gameState.isPlaying) {
      startTimer();
    }
  }, [gameState.currentQuestion, gameState.isPlaying, startTimer]);

  // Handle timeout
  useEffect(() => {
    if (gameState.timeLeft === 0 && gameState.isPlaying) {
      // Time's up - move to next question
      setTimeout(() => {
        startNewQuestion();
      }, 2000);
    }
  }, [gameState.timeLeft, gameState.isPlaying, startNewQuestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return {
    gameState,
    highScore: highScoreData?.highScore || 0,
    startGame,
    endGame,
    selectAnswer,
    startNewQuestion,
  };
}
