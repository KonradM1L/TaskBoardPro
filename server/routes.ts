import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBoardSchema, insertListSchema, insertCardSchema, updateCardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Board routes
  app.get("/api/boards", async (req, res) => {
    try {
      const boards = await storage.getBoards();
      res.json(boards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch boards" });
    }
  });

  app.get("/api/boards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const board = await storage.getBoard(id);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
      res.json(board);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch board" });
    }
  });

  app.post("/api/boards", async (req, res) => {
    try {
      const validatedData = insertBoardSchema.parse(req.body);
      const board = await storage.createBoard(validatedData);
      res.status(201).json(board);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid board data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create board" });
    }
  });

  app.put("/api/boards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBoardSchema.partial().parse(req.body);
      const board = await storage.updateBoard(id, validatedData);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
      res.json(board);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid board data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update board" });
    }
  });

  app.delete("/api/boards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBoard(id);
      if (!deleted) {
        return res.status(404).json({ message: "Board not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete board" });
    }
  });

  // List routes
  app.get("/api/boards/:boardId/lists", async (req, res) => {
    try {
      const boardId = parseInt(req.params.boardId);
      const lists = await storage.getLists(boardId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lists" });
    }
  });

  app.post("/api/lists", async (req, res) => {
    try {
      const validatedData = insertListSchema.parse(req.body);
      const list = await storage.createList(validatedData);
      res.status(201).json(list);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid list data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create list" });
    }
  });

  app.put("/api/lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertListSchema.partial().parse(req.body);
      const list = await storage.updateList(id, validatedData);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      res.json(list);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid list data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update list" });
    }
  });

  app.delete("/api/lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteList(id);
      if (!deleted) {
        return res.status(404).json({ message: "List not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete list" });
    }
  });

  // Card routes
  app.get("/api/lists/:listId/cards", async (req, res) => {
    try {
      const listId = parseInt(req.params.listId);
      const cards = await storage.getCards(listId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.get("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const card = await storage.getCard(id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch card" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(validatedData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create card" });
    }
  });

  app.put("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateCardSchema.parse(req.body);
      const card = await storage.updateCard(id, validatedData);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update card" });
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCard(id);
      if (!deleted) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  app.post("/api/cards/:id/move", async (req, res) => {
    try {
      const cardId = parseInt(req.params.id);
      const { listId, position } = req.body;
      
      if (typeof listId !== 'number' || typeof position !== 'number') {
        return res.status(400).json({ message: "Invalid move data" });
      }

      const card = await storage.moveCard(cardId, listId, position);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to move card" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
