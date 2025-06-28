import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Star, Clock, Trophy, Calculator } from "lucide-react";
import type { Question, GameState } from "@shared/schema";

interface GameHeaderProps {
  gameStarted: boolean;
  onStartGame: () => void;
  highScore: number;
}

export function GameHeader({ gameStarted, onStartGame, highScore }: GameHeaderProps) {
  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-fredoka text-4xl text-white mb-2 flex items-center justify-center gap-2">
        <Calculator className="text-sunny w-10 h-10" />
        Math Fun!
      </h1>
      <p className="text-white/80 text-lg mb-4">Let's practice addition together!</p>
      
      {!gameStarted && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={onStartGame}
            className="bg-coral hover:bg-red-400 text-white font-bold py-4 px-8 rounded-2xl text-xl font-fredoka button-hover transform transition-all duration-300 hover:scale-105"
          >
            <Heart className="mr-2 w-6 h-6" />
            Start Playing!
          </Button>
          {highScore > 0 && (
            <p className="text-white/60 text-sm mt-2">
              <Trophy className="inline w-4 h-4 mr-1" />
              High Score: {highScore}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

interface GameStatsProps {
  score: number;
  timeLeft: number;
  correctCount: number;
  totalQuestions: number;
}

export function GameStats({ score, timeLeft, correctCount, totalQuestions }: GameStatsProps) {
  return (
    <>
      {/* Score and Timer Container */}
      <div className="flex justify-between items-center mb-6">
        <motion.div 
          className="bg-white rounded-2xl px-6 py-3 card-shadow"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center space-x-2">
            <Star className="text-sunny w-5 h-5" />
            <span className="font-bold text-gray-700">
              Score: <span className="text-coral">{score}</span>
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-2xl px-6 py-3 card-shadow"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center space-x-2">
            <Clock className="text-skyblue w-5 h-5" />
            <span className="font-bold text-gray-700">
              Time: <span className="text-coral">{timeLeft}</span>s
            </span>
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div 
            className="bg-sunny h-full rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / 5) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Game Stats */}
      <motion.div 
        className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-white/80 text-sm mb-1">Correct</div>
            <div className="text-white font-bold text-2xl font-fredoka">{correctCount}</div>
          </div>
          <div>
            <div className="text-white/80 text-sm mb-1">Questions</div>
            <div className="text-white font-bold text-2xl font-fredoka">{totalQuestions}</div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

interface QuestionCardProps {
  question: Question;
  onAnswerSelect: (answer: number) => void;
  disabled: boolean;
}

export function QuestionCard({ question, onAnswerSelect, disabled }: QuestionCardProps) {
  return (
    <motion.div
      key={question.display}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white rounded-3xl p-8 card-shadow mb-6">
        <div className="text-center">
          <h2 className="font-fredoka text-2xl text-gray-600 mb-4">What is the answer?</h2>
          
          <motion.div 
            className="bg-white border-4 border-blue-500 rounded-2xl p-8 mb-6 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="font-fredoka text-6xl text-gray-800 font-bold">
              {question.num1} + {question.num2} = ?
            </div>
          </motion.div>
          
          {/* Answer Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.div
                key={`${question.display}-${index}`}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={() => !disabled && onAnswerSelect(option)}
                  disabled={disabled}
                  className={`w-full text-white font-bold py-6 px-8 rounded-2xl text-2xl font-fredoka button-hover transform transition-all duration-300 ${
                    index === 0
                      ? "bg-coral hover:bg-red-400"
                      : "bg-mint hover:bg-green-400"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {index === 0 ? (
                    <Heart className="mr-3 w-6 h-6" />
                  ) : (
                    <Star className="mr-3 w-6 h-6" />
                  )}
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
}

export function SuccessModal({ show, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 m-4 max-w-sm w-full text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎉
            </motion.div>
            <h3 className="font-fredoka text-3xl text-mint mb-2">Great Job!</h3>
            <p className="text-gray-600 text-lg mb-6">You got it right!</p>
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ["#FFEAA7", "#FF6B6B", "#4ECDC4"][i] }}
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface WrongModalProps {
  show: boolean;
  correctAnswer: number;
  onClose: () => void;
}

export function WrongModal({ show, correctAnswer, onClose }: WrongModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 m-4 max-w-sm w-full text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              😊
            </motion.div>
            <h3 className="font-fredoka text-3xl text-coral mb-2">Try Again!</h3>
            <p className="text-gray-600 text-lg mb-2">The correct answer was:</p>
            <motion.div 
              className="bg-mint text-white font-fredoka text-2xl py-2 px-4 rounded-xl mb-4 inline-block"
              whileHover={{ scale: 1.05 }}
            >
              {correctAnswer}
            </motion.div>
            <p className="text-gray-500 text-sm">Keep practicing!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ConfettiProps {
  show: boolean;
}

export function Confetti({ show }: ConfettiProps) {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
  
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                left: `${Math.random() * 100}%`,
                top: "100%",
              }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{ 
                y: -window.innerHeight - 100, 
                rotate: 180, 
                opacity: 0 
              }}
              transition={{ 
                duration: Math.random() * 3 + 2,
                delay: i * 0.05,
                ease: "easeOut" 
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

interface GameCompleteModalProps {
  show: boolean;
  score: number;
  correctCount: number;
  totalQuestions: number;
  totalTime: number;
  onRestart: () => void;
}

export function GameCompleteModal({ show, score, correctCount, totalQuestions, totalTime, onRestart }: GameCompleteModalProps) {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };
  
  // Debug logging to see what values we're getting
  console.log("GameComplete Modal - Score:", score, "Time:", totalTime, "Accuracy:", accuracy);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 m-4 max-w-md w-full text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎉
            </motion.div>
            <h3 className="font-fredoka text-3xl text-mint mb-4">Game Complete!</h3>
            
            <div className="bg-gradient-to-r from-turquoise to-skyblue rounded-2xl p-6 mb-6 text-white">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm opacity-80">Final Score</div>
                  <div className="font-fredoka text-2xl">{score || 0}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Accuracy</div>
                  <div className="font-fredoka text-2xl">{accuracy}%</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Time</div>
                  <div className="font-fredoka text-2xl">{totalTime > 0 ? formatTime(totalTime) : "0s"}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="text-sm opacity-80">
                  You got {correctCount} out of {totalQuestions} questions correct!
                </div>
              </div>
            </div>
            
            <Button
              onClick={onRestart}
              className="bg-coral hover:bg-red-400 text-white font-bold py-4 px-8 rounded-2xl text-xl font-fredoka button-hover w-full"
            >
              <Heart className="mr-2 w-6 h-6" />
              Play Again!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
