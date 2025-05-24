import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
});

export const lists = pgTable("lists", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  boardId: integer("board_id").notNull(),
  position: integer("position").notNull().default(0),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  listId: integer("list_id").notNull(),
  position: integer("position").notNull().default(0),
  labels: text("labels").array(),
  dueDate: text("due_date"),
});

export const insertBoardSchema = createInsertSchema(boards).omit({
  id: true,
});

export const insertListSchema = createInsertSchema(lists).omit({
  id: true,
  position: true,
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  position: true,
});

export const updateCardSchema = createInsertSchema(cards).omit({
  id: true,
}).partial();

export type InsertBoard = z.infer<typeof insertBoardSchema>;
export type InsertList = z.infer<typeof insertListSchema>;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type UpdateCard = z.infer<typeof updateCardSchema>;

export type Board = typeof boards.$inferSelect;
export type List = typeof lists.$inferSelect;
export type Card = typeof cards.$inferSelect;
