import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Define the API routes
  const apiRouter = app.route("/api");

  // Get all games
  app.get("/api/games", async (req: Request, res: Response) => {
    try {
      const games = await storage.getGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Get game by ID
  app.get("/api/games/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await storage.getGameById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Get games by category
  app.get("/api/games/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const games = await storage.getGamesByCategory(category);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games by category" });
    }
  });

  // Search games
  app.get("/api/games/search/:query", async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      const games = await storage.searchGames(query);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to search games" });
    }
  });

  // Create a new game
  app.post("/api/games", async (req: Request, res: Response) => {
    try {
      const validatedGame = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(validatedGame);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
