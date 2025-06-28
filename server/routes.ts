import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStatsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Save game statistics
  app.post("/api/game-stats", async (req, res) => {
    try {
      const validatedData = insertGameStatsSchema.parse(req.body);
      const savedStats = await storage.saveGameStats(validatedData);
      res.json(savedStats);
    } catch (error) {
      res.status(400).json({ error: "Invalid game stats data" });
    }
  });

  // Get high score
  app.get("/api/high-score", async (req, res) => {
    try {
      const highScore = await storage.getHighScore();
      res.json({ highScore });
    } catch (error) {
      res.status(500).json({ error: "Failed to get high score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
