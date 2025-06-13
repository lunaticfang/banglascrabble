import { db } from "./db";
import { players, games, gameMembers, moves, type Player, type Game, type GameMember, type Move, type InsertPlayer, type InsertGame, type InsertGameMember, type InsertMove, type GameState } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { BANGLA_TILES } from "../client/src/lib/bangla-tiles";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getPlayer(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.username, username));
    return result[0];
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(player).returning();
    return result[0];
  }

  async createGame(): Promise<Game> {
    const tileBag = this.shuffleTiles([...BANGLA_TILES]);
    const board = new Array(225).fill(null); // 15x15 board
    
    const result = await db.insert(games).values({
      status: "waiting",
      board,
      tileBag,
    }).returning();
    
    return result[0];
  }

  async getGame(id: number): Promise<Game | undefined> {
    const result = await db.select().from(games).where(eq(games.id, id));
    return result[0];
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined> {
    const result = await db.update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();
    return result[0];
  }

  async addPlayerToGame(gameId: number, playerId: number): Promise<GameMember> {
    // Get current game to access tile bag
    const game = await this.getGame(gameId);
    if (!game) throw new Error("Game not found");
    
    // Draw 7 tiles for the player
    const playerTiles = game.tileBag.splice(0, 7);
    
    // Update game's tile bag
    await this.updateGame(gameId, { tileBag: game.tileBag });
    
    // Add player to game
    const result = await db.insert(gameMembers).values({
      gameId,
      playerId,
      tiles: playerTiles,
    }).returning();
    
    return result[0];
  }

  async getGameMembers(gameId: number): Promise<GameMember[]> {
    return await db.select().from(gameMembers).where(eq(gameMembers.gameId, gameId));
  }

  async updateGameMember(gameId: number, playerId: number, updates: Partial<GameMember>): Promise<GameMember | undefined> {
    const result = await db.update(gameMembers)
      .set(updates)
      .where(and(eq(gameMembers.gameId, gameId), eq(gameMembers.playerId, playerId)))
      .returning();
    return result[0];
  }

  async addMove(move: InsertMove): Promise<Move> {
    const result = await db.insert(moves).values({
      gameId: move.gameId,
      playerId: move.playerId,
      word: move.word,
      tiles: move.tiles as {letter: string, row: number, col: number, points: number}[],
      score: move.score,
    }).returning();
    return result[0];
  }

  async getGameMoves(gameId: number): Promise<Move[]> {
    return await db.select().from(moves)
      .where(eq(moves.gameId, gameId))
      .orderBy(moves.createdAt);
  }

  async getGameState(gameId: number): Promise<GameState | undefined> {
    const game = await this.getGame(gameId);
    if (!game) return undefined;

    const gameMembers = await this.getGameMembers(gameId);
    const gameMoves = await this.getGameMoves(gameId);
    
    const playersWithScores = await Promise.all(
      gameMembers.map(async (gm) => {
        const player = await this.getPlayer(gm.playerId);
        return player ? { ...player, score: gm.score, tiles: gm.tiles } : null;
      })
    );

    const currentPlayer = game.currentPlayerId 
      ? await this.getPlayer(game.currentPlayerId)
      : null;

    return {
      game,
      players: playersWithScores.filter(Boolean) as (Player & { score: number; tiles: string[] })[],
      currentPlayer,
      moves: gameMoves,
    };
  }

  private shuffleTiles(tiles: string[]): string[] {
    const shuffled = [...tiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}