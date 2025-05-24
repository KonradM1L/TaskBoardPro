import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  boolean,
  integer
} from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

// Tabela użytkowników
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(), // zahashowane
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Schemat dla rejestracji
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Login musi mieć co najmniej 3 znaki").max(50),
  email: z.string().email("Nieprawidłowy format email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  firstName: z.string().min(1, "Imię jest wymagane").max(50),
  lastName: z.string().min(1, "Nazwisko jest wymagane").max(50),
}).omit({ id: true, createdAt: true, updatedAt: true })

// Schemat dla logowania
export const loginSchema = z.object({
  username: z.string().min(1, "Login jest wymagany"),
  password: z.string().min(1, "Hasło jest wymagane"),
})

// Typy TypeScript
export type User = typeof users.$inferSelect
export type InsertUser = z.infer<typeof insertUserSchema>
export type LoginData = z.infer<typeof loginSchema>