import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/use-game";
import { 
  GameHeader, 
  GameStats, 
  QuestionCard, 
  SuccessModal, 
  WrongModal, 
  Confetti,
  GameCompleteModal
} from "@/components/game-components";

export default function Game() {
  const { gameState, highScore, startGame, selectAnswer, startNewQuestion, endGame, setLevel } = useGame();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [finalGameStats, setFinalGameStats] = useState({ score: 0, correctCount: 0, totalQuestions: 0, totalTime: 0 });

  const handleAnswerSelect = async (selectedAnswer: number) => {
    if (buttonsDisabled || !gameState.currentQuestion) return;
    
    setButtonsDisabled(true);
    const isCorrect = selectAnswer(selectedAnswer);
    
    // Calculate final stats immediately with current answer included
    const finalScore = gameState.score + (isCorrect ? 10 : 0);
    const finalCorrectCount = gameState.correctCount + (isCorrect ? 1 : 0);
    const finalTotalTime = gameState.startTime ? Math.round((Date.now() - gameState.startTime) / 1000) : 0;
    
    // Check if this was the 10th question before showing any modals
    const isGameComplete = gameState.totalQuestions >= 10;
    
    if (isCorrect) {
      setShowSuccessModal(true);
      setShowConfetti(true);
      
      // Hide success modal and confetti after animation
      setTimeout(() => {
        setShowSuccessModal(false);
        setShowConfetti(false);
        setButtonsDisabled(false);
        
        if (isGameComplete) {
          const finalStats = {
            score: finalScore,
            correctCount: finalCorrectCount,
            totalQuestions: gameState.totalQuestions,
            totalTime: finalTotalTime
          };

          setFinalGameStats(finalStats);
          endGame(finalScore, finalCorrectCount);
          setTimeout(() => {
            setShowGameComplete(true);
          }, 500);
        } else {
          startNewQuestion();
        }
      }, 2500);
    } else {
      setShowWrongModal(true);
      
      // Hide wrong modal after delay
      setTimeout(() => {
        setShowWrongModal(false);
        setButtonsDisabled(false);
        
        if (isGameComplete) {
          const finalStats = {
            score: finalScore,
            correctCount: finalCorrectCount,
            totalQuestions: gameState.totalQuestions,
            totalTime: finalTotalTime
          };

          setFinalGameStats(finalStats);
          endGame(finalScore, finalCorrectCount);
          setTimeout(() => {
            setShowGameComplete(true);
          }, 500);
        } else {
          startNewQuestion();
        }
      }, 2500);
    }
  };

  // Handle timeout
  useEffect(() => {
    if (gameState.timeLeft === 0 && gameState.isPlaying && gameState.currentQuestion) {
      setShowWrongModal(true);
      setButtonsDisabled(true);
      
      setTimeout(() => {
        setShowWrongModal(false);
        setButtonsDisabled(false);
        
        // Check if this was the 10th question
        if (gameState.totalQuestions >= 10) {
          // Calculate final stats for timeout (no points added for wrong/timeout)
          const finalStats = {
            score: gameState.score,
            correctCount: gameState.correctCount,
            totalQuestions: gameState.totalQuestions,
            totalTime: gameState.startTime ? Math.round((Date.now() - gameState.startTime) / 1000) : 0
          };

          setFinalGameStats(finalStats);
          endGame();
          setTimeout(() => {
            setShowGameComplete(true);
          }, 500);
        } else {
          startNewQuestion();
        }
      }, 2000);
    }
  }, [gameState.timeLeft, gameState.isPlaying, gameState.currentQuestion, gameState.totalQuestions, gameState.score, gameState.correctCount, gameState.startTime, startNewQuestion, endGame]);

  // Handle game completion - removed automatic trigger since we handle it manually

  const handleRestart = () => {
    setShowGameComplete(false);
    startGame();
  };

  return (
    <div className="gradient-bg min-h-screen font-opensans">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        
        <GameHeader 
          gameStarted={gameState.gameStarted}
          onStartGame={startGame}
          highScore={highScore}
          currentLevel={gameState.level}
          onLevelChange={setLevel}
        />

        {gameState.isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameStats
              score={gameState.score}
              timeLeft={gameState.timeLeft}
              correctCount={gameState.correctCount}
              totalQuestions={gameState.totalQuestions}
              currentLevel={gameState.level}
            />

            {gameState.currentQuestion && (
              <QuestionCard
                question={gameState.currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                disabled={buttonsDisabled}
              />
            )}
          </motion.div>
        )}

        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />

        <WrongModal
          show={showWrongModal}
          correctAnswer={gameState.currentQuestion?.correctAnswer || 0}
          onClose={() => setShowWrongModal(false)}
        />

        <GameCompleteModal
          show={showGameComplete}
          score={finalGameStats.totalQuestions > 0 ? finalGameStats.score : 0}
          correctCount={finalGameStats.totalQuestions > 0 ? finalGameStats.correctCount : 0}
          totalQuestions={finalGameStats.totalQuestions > 0 ? finalGameStats.totalQuestions : 10}
          totalTime={finalGameStats.totalQuestions > 0 ? finalGameStats.totalTime : 0}
          onRestart={handleRestart}
        />

        <Confetti show={showConfetti} />
      </div>
    </div>
  );
}
