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
  const { gameState, highScore, startGame, selectAnswer, startNewQuestion, endGame } = useGame();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);

  const handleAnswerSelect = async (selectedAnswer: number) => {
    if (buttonsDisabled || !gameState.currentQuestion) return;
    
    setButtonsDisabled(true);
    const isCorrect = selectAnswer(selectedAnswer);
    
    if (isCorrect) {
      setShowSuccessModal(true);
      setShowConfetti(true);
      
      // Hide success modal and confetti after animation
      setTimeout(() => {
        setShowSuccessModal(false);
        setShowConfetti(false);
        setButtonsDisabled(false);
        
        // Check if this was the 10th question
        if (gameState.totalQuestions >= 10) {
          // End game and calculate total time
          endGame();
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
        
        // Check if this was the 10th question
        if (gameState.totalQuestions >= 10) {
          // End game and calculate total time
          endGame();
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
          // End game and calculate total time
          endGame();
          setTimeout(() => {
            setShowGameComplete(true);
          }, 500);
        } else {
          startNewQuestion();
        }
      }, 2000);
    }
  }, [gameState.timeLeft, gameState.isPlaying, gameState.currentQuestion, gameState.totalQuestions, startNewQuestion]);

  // Handle game completion
  useEffect(() => {
    if (!gameState.isPlaying && gameState.gameStarted && gameState.totalQuestions >= 10) {
      setShowGameComplete(true);
    }
  }, [gameState.isPlaying, gameState.gameStarted, gameState.totalQuestions]);

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
          score={gameState.score}
          correctCount={gameState.correctCount}
          totalQuestions={gameState.totalQuestions}
          totalTime={gameState.totalTime}
          onRestart={handleRestart}
        />

        <Confetti show={showConfetti} />
      </div>
    </div>
  );
}
