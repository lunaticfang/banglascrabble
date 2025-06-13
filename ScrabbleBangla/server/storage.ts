import { players, games, gameMembers, moves, type Player, type Game, type GameMember, type Move, type InsertPlayer, type InsertGame, type InsertGameMember, type InsertMove, type GameState } from "@shared/schema";
import { BANGLA_TILES } from "../client/src/lib/bangla-tiles";
import { DatabaseStorage } from "./database-storage";

export interface IStorage {
  // Player operations
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayerByUsername(username: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  // Game operations
  createGame(): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined>;
  
  // Game member operations
  addPlayerToGame(gameId: number, playerId: number): Promise<GameMember>;
  getGameMembers(gameId: number): Promise<GameMember[]>;
  updateGameMember(gameId: number, playerId: number, updates: Partial<GameMember>): Promise<GameMember | undefined>;
  
  // Move operations
  addMove(move: InsertMove): Promise<Move>;
  getGameMoves(gameId: number): Promise<Move[]>;
  
  // Game state
  getGameState(gameId: number): Promise<GameState | undefined>;
}

export class MemStorage implements IStorage {
  private players: Map<number, Player>;
  private games: Map<number, Game>;
  private gameMembers: Map<string, GameMember>;
  private moves: Map<number, Move>;
  private currentIds: { player: number; game: number; gameMember: number; move: number };

  constructor() {
    this.players = new Map();
    this.games = new Map();
    this.gameMembers = new Map();
    this.moves = new Map();
    this.currentIds = { player: 1, game: 1, gameMember: 1, move: 1 };
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(p => p.username === username);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const player: Player = {
      id: this.currentIds.player++,
      ...insertPlayer,
      currentGameId: null,
    };
    this.players.set(player.id, player);
    return player;
  }

  async createGame(): Promise<Game> {
    const tileBag = this.shuffleTiles([...BANGLA_TILES]);
    const game: Game = {
      id: this.currentIds.game++,
      status: "waiting",
      currentPlayerId: null,
      board: new Array(225).fill(null), // 15x15 board
      tileBag,
      createdAt: new Date(),
    };
    this.games.set(game.id, game);
    return game;
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async addPlayerToGame(gameId: number, playerId: number): Promise<GameMember> {
    const key = `${gameId}-${playerId}`;
    const tileBag = this.games.get(gameId)?.tileBag || [];
    const playerTiles = tileBag.splice(0, 7); // Give player 7 tiles
    
    // Update game's tile bag
    const game = this.games.get(gameId);
    if (game) {
      game.tileBag = tileBag;
      this.games.set(gameId, game);
    }

    const gameMember: GameMember = {
      id: this.currentIds.gameMember++,
      gameId,
      playerId,
      score: 0,
      tiles: playerTiles,
      joinedAt: new Date(),
    };
    
    this.gameMembers.set(key, gameMember);
    return gameMember;
  }

  async getGameMembers(gameId: number): Promise<GameMember[]> {
    return Array.from(this.gameMembers.values()).filter(gm => gm.gameId === gameId);
  }

  async updateGameMember(gameId: number, playerId: number, updates: Partial<GameMember>): Promise<GameMember | undefined> {
    const key = `${gameId}-${playerId}`;
    const gameMember = this.gameMembers.get(key);
    if (!gameMember) return undefined;
    
    const updatedGameMember = { ...gameMember, ...updates };
    this.gameMembers.set(key, updatedGameMember);
    return updatedGameMember;
  }

  async addMove(insertMove: InsertMove): Promise<Move> {
    const move: Move = {
      id: this.currentIds.move++,
      gameId: insertMove.gameId,
      playerId: insertMove.playerId,
      word: insertMove.word,
      tiles: insertMove.tiles as {letter: string, row: number, col: number, points: number}[],
      score: insertMove.score,
      createdAt: new Date(),
    };
    this.moves.set(move.id, move);
    return move;
  }

  async getGameMoves(gameId: number): Promise<Move[]> {
    return Array.from(this.moves.values())
      .filter(m => m.gameId === gameId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getGameState(gameId: number): Promise<GameState | undefined> {
    const game = await this.getGame(gameId);
    if (!game) return undefined;

    const gameMembers = await this.getGameMembers(gameId);
    const moves = await this.getGameMoves(gameId);
    
    const players = await Promise.all(
      gameMembers.map(async (gm) => {
        const player = await this.getPlayer(gm.playerId);
        return player ? { ...player, score: gm.score, tiles: gm.tiles } : null;
      })
    );

    const currentPlayer = game.currentPlayerId 
      ? (await this.getPlayer(game.currentPlayerId)) || null
      : null;

    return {
      game,
      players: players.filter(Boolean) as (Player & { score: number; tiles: string[] })[],
      currentPlayer,
      moves,
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

export const storage = new DatabaseStorage();
