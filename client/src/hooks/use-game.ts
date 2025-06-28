import { useState, useEffect, useCallback, useRef } from "react";
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
    startTime: null,
    totalTime: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Generate random math question (addition or subtraction)
  const generateQuestion = useCallback((): Question => {
    const isAddition = Math.random() < 0.5; // 50% chance for addition or subtraction
    
    let num1: number;
    let num2: number;
    let correctAnswer: number;
    let display: string;
    let maxWrongAnswer: number;

    if (isAddition) {
      // Addition: both numbers 0-9
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      correctAnswer = num1 + num2;
      display = `${num1} + ${num2} = ?`;
      maxWrongAnswer = 18; // Max possible for single digit addition
    } else {
      // Subtraction: ensure positive result
      num1 = Math.floor(Math.random() * 10); // 0-9
      num2 = Math.floor(Math.random() * (num1 + 1)); // 0 to num1 (ensures positive result)
      correctAnswer = num1 - num2;
      display = `${num1} - ${num2} = ?`;
      maxWrongAnswer = 9; // Max possible for single digit subtraction
    }
    
    // Generate wrong answer (different from correct)
    let wrongAnswer;
    do {
      wrongAnswer = Math.floor(Math.random() * (maxWrongAnswer + 1));
    } while (wrongAnswer === correctAnswer || wrongAnswer < 0);

    // Randomly decide which position gets the correct answer
    const correctIndex = Math.random() < 0.5 ? 0 : 1;
    const options = correctIndex === 0 ? [correctAnswer, wrongAnswer] : [wrongAnswer, correctAnswer];

    return {
      display,
      num1,
      num2,
      correctAnswer,
      options,
      correctIndex,
    };
  }, []);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

  // Handle answer selection
  const selectAnswer = useCallback((selectedAnswer: number) => {
    stopTimer();
    
    if (!gameState.currentQuestion) return false;

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
    const now = Date.now();
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameStarted: true,
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      startTime: now,
      totalTime: 0,
    }));
    startNewQuestion();
  }, [startNewQuestion]);

  // End game
  const endGame = useCallback(() => {
    stopTimer();
    const endTime = Date.now();
    const totalTime = gameState.startTime ? Math.round((endTime - gameState.startTime) / 1000) : 0;
    
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: false,
      totalTime: totalTime
    }));
    
    // Save game stats
    if (gameState.totalQuestions > 0) {
      saveStatsMutation.mutate({
        score: gameState.score,
        correctAnswers: gameState.correctCount,
        totalQuestions: gameState.totalQuestions,
      });
    }
  }, [gameState.score, gameState.correctCount, gameState.totalQuestions, gameState.startTime, stopTimer, saveStatsMutation]);

  // Start timer when new question is set
  useEffect(() => {
    if (gameState.currentQuestion && gameState.isPlaying && gameState.timeLeft === 5) {
      startTimer();
    }
  }, [gameState.currentQuestion, gameState.isPlaying, gameState.timeLeft, startTimer]);

  // Handle game completion manually from the component

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    highScore: (highScoreData as { highScore: number } | undefined)?.highScore || 0,
    startGame,
    endGame,
    selectAnswer,
    startNewQuestion,
  };
}