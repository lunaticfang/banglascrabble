import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  currentGameId: integer("current_game_id"),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  status: text("status").notNull().default("waiting"), // waiting, active, finished
  currentPlayerId: integer("current_player_id"),
  board: json("board").$type<(string | null)[]>().notNull().default([]),
  tileBag: json("tile_bag").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameMembers = pgTable("game_members", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  playerId: integer("player_id").notNull(),
  score: integer("score").notNull().default(0),
  tiles: json("tiles").$type<string[]>().notNull().default([]),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const moves = pgTable("moves", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  playerId: integer("player_id").notNull(),
  word: text("word").notNull(),
  tiles: json("tiles").$type<{letter: string, row: number, col: number, points: number}[]>().notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertPlayerSchema = createInsertSchema(players).pick({
  username: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  status: true,
});

export const insertGameMemberSchema = createInsertSchema(gameMembers).pick({
  gameId: true,
  playerId: true,
});

export const insertMoveSchema = createInsertSchema(moves).pick({
  gameId: true,
  playerId: true,
  word: true,
  tiles: true,
  score: true,
});

// Types
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type GameMember = typeof gameMembers.$inferSelect;
export type InsertGameMember = z.infer<typeof insertGameMemberSchema>;

export type Move = typeof moves.$inferSelect;
export type InsertMove = z.infer<typeof insertMoveSchema>;

// Game state types
export type GameState = {
  game: Game;
  players: (Player & { score: number; tiles: string[] })[];
  currentPlayer: Player | null;
  moves: Move[];
};

export type TileMove = {
  letter: string;
  row: number;
  col: number;
  points: number;
};
