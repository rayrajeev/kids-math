import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  score: integer("score").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGameStatsSchema = createInsertSchema(gameStats).omit({
  id: true,
  createdAt: true,
});

export type InsertGameStats = z.infer<typeof insertGameStatsSchema>;
export type GameStats = typeof gameStats.$inferSelect;

// Question types for the game
export interface Question {
  display: string;
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
  correctIndex: number;
}

export interface GameState {
  score: number;
  currentQuestion: Question | null;
  timeLeft: number;
  isPlaying: boolean;
  correctCount: number;
  totalQuestions: number;
  gameStarted: boolean;
  startTime: number | null;
  totalTime: number;
  level: number;
}
