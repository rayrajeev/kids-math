import { gameStats, type GameStats, type InsertGameStats } from "@shared/schema";

export interface IStorage {
  saveGameStats(stats: InsertGameStats): Promise<GameStats>;
  getHighScore(): Promise<number>;
}

export class MemStorage implements IStorage {
  private gameStats: GameStats[];
  private currentId: number;

  constructor() {
    this.gameStats = [];
    this.currentId = 1;
  }

  async saveGameStats(insertStats: InsertGameStats): Promise<GameStats> {
    const stats: GameStats = {
      ...insertStats,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.gameStats.push(stats);
    return stats;
  }

  async getHighScore(): Promise<number> {
    if (this.gameStats.length === 0) return 0;
    return Math.max(...this.gameStats.map(stat => stat.score));
  }
}

export const storage = new MemStorage();
