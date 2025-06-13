import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPlayerSchema, insertMoveSchema } from "@shared/schema";

interface GameSocket extends WebSocket {
  playerId?: number;
  gameId?: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const gameRooms = new Map<number, Set<GameSocket>>();

  // Player routes
  app.post("/api/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      
      // Check if player already exists
      const existingPlayer = await storage.getPlayerByUsername(playerData.username);
      if (existingPlayer) {
        return res.json(existingPlayer);
      }
      
      const player = await storage.createPlayer(playerData);
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(parseInt(req.params.id));
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Game routes
  app.post("/api/games", async (req, res) => {
    try {
      const game = await storage.createGame();
      res.json(game);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameState = await storage.getGameState(parseInt(req.params.id));
      if (!gameState) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(gameState);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/games/:id/join", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { playerId } = req.body;

      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const gameMembers = await storage.getGameMembers(gameId);
      if (gameMembers.length >= 4) {
        return res.status(400).json({ message: "Game is full" });
      }

      // Check if player already in game
      if (gameMembers.some(gm => gm.playerId === playerId)) {
        return res.status(400).json({ message: "Player already in game" });
      }

      const gameMember = await storage.addPlayerToGame(gameId, playerId);
      
      // Start game if we have 2+ players
      const updatedMembers = await storage.getGameMembers(gameId);
      if (updatedMembers.length >= 2 && game.status === "waiting") {
        await storage.updateGame(gameId, {
          status: "active",
          currentPlayerId: updatedMembers[0].playerId,
        });
      }

      // Broadcast game state update
      const gameState = await storage.getGameState(gameId);
      broadcastToGame(gameId, { type: "gameStateUpdate", gameState });

      res.json(gameMember);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/games/:id/moves", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const moveData = insertMoveSchema.parse({ ...req.body, gameId });

      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.status !== "active") {
        return res.status(400).json({ message: "Game is not active" });
      }

      if (game.currentPlayerId !== moveData.playerId) {
        return res.status(400).json({ message: "Not your turn" });
      }

      // Validate move and update board
      const isValidMove = await validateMove(gameId, moveData);
      if (!isValidMove) {
        return res.status(400).json({ message: "Invalid move" });
      }

      // Add move to storage
      const move = await storage.addMove(moveData);

      // Update game state
      await updateGameAfterMove(gameId, moveData);

      // Broadcast move to all players
      const gameState = await storage.getGameState(gameId);
      broadcastToGame(gameId, { type: "moveSubmitted", move, gameState });

      res.json(move);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Skip turn
  app.post("/api/games/:id/skip", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { playerId } = req.body;

      const game = await storage.getGame(gameId);
      if (!game || game.currentPlayerId !== playerId) {
        return res.status(400).json({ message: "Cannot skip turn" });
      }

      // Move to next player
      const gameMembers = await storage.getGameMembers(gameId);
      const currentIndex = gameMembers.findIndex(gm => gm.playerId === playerId);
      const nextIndex = (currentIndex + 1) % gameMembers.length;
      const nextPlayerId = gameMembers[nextIndex].playerId;

      await storage.updateGame(gameId, { currentPlayerId: nextPlayerId });

      const gameState = await storage.getGameState(gameId);
      broadcastToGame(gameId, { type: "turnSkipped", gameState });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // WebSocket handling
  wss.on('connection', (ws: GameSocket) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'joinGame':
            ws.playerId = data.playerId;
            ws.gameId = data.gameId;
            
            if (!gameRooms.has(data.gameId)) {
              gameRooms.set(data.gameId, new Set());
            }
            gameRooms.get(data.gameId)!.add(ws);
            
            // Send current game state
            const gameState = await storage.getGameState(data.gameId);
            if (gameState) {
              ws.send(JSON.stringify({ type: 'gameStateUpdate', gameState }));
            }
            break;
            
          case 'leaveGame':
            if (ws.gameId && gameRooms.has(ws.gameId)) {
              gameRooms.get(ws.gameId)!.delete(ws);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (ws.gameId && gameRooms.has(ws.gameId)) {
        gameRooms.get(ws.gameId)!.delete(ws);
      }
    });
  });

  function broadcastToGame(gameId: number, message: any) {
    const room = gameRooms.get(gameId);
    if (room) {
      const messageStr = JSON.stringify(message);
      room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  async function validateMove(gameId: number, moveData: any): Promise<boolean> {
    // Basic validation - in a real app, this would include comprehensive word validation
    const game = await storage.getGame(gameId);
    if (!game) return false;

    // Check if tiles can be placed on board
    for (const tile of moveData.tiles) {
      const index = tile.row * 15 + tile.col;
      if (index < 0 || index >= 225) return false;
      if (game.board[index] !== null) return false; // Position already occupied
    }

    return true;
  }

  async function updateGameAfterMove(gameId: number, moveData: any) {
    const game = await storage.getGame(gameId);
    if (!game) return;

    // Update board
    const newBoard = [...game.board];
    for (const tile of moveData.tiles) {
      const index = tile.row * 15 + tile.col;
      newBoard[index] = tile.letter;
    }

    // Update player score and tiles
    const gameMember = await storage.updateGameMember(
      gameId, 
      moveData.playerId, 
      { score: (await storage.getGameMembers(gameId))
        .find(gm => gm.playerId === moveData.playerId)!.score + moveData.score }
    );

    // Draw new tiles for player
    const tilesUsed = moveData.tiles.length;
    const newTiles = game.tileBag.splice(0, tilesUsed);
    if (gameMember) {
      const updatedTiles = gameMember.tiles.filter(
        (tile: string) => !moveData.tiles.some((moveTile: any) => moveTile.letter === tile)
      );
      updatedTiles.push(...newTiles);
      
      await storage.updateGameMember(gameId, moveData.playerId, { tiles: updatedTiles });
    }

    // Move to next player
    const gameMembers = await storage.getGameMembers(gameId);
    const currentIndex = gameMembers.findIndex(gm => gm.playerId === moveData.playerId);
    const nextIndex = (currentIndex + 1) % gameMembers.length;
    const nextPlayerId = gameMembers[nextIndex].playerId;

    await storage.updateGame(gameId, {
      board: newBoard,
      tileBag: game.tileBag,
      currentPlayerId: nextPlayerId,
    });
  }

  return httpServer;
}
