import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db'
import { users } from '../shared/schema'
import { eq } from 'drizzle-orm'
import type { InsertUser, LoginData, User } from '../shared/schema'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }
  } catch {
    return null
  }
}

export async function registerUser(userData: InsertUser): Promise<{ user: User; token: string }> {
  // Sprawdź czy użytkownik już istnieje
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, userData.username))
    .limit(1)

  if (existingUser.length > 0) {
    throw new Error('Użytkownik o tym loginie już istnieje')
  }

  const existingEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, userData.email))
    .limit(1)

  if (existingEmail.length > 0) {
    throw new Error('Użytkownik o tym adresie email już istnieje')
  }

  // Zahashuj hasło
  const hashedPassword = await hashPassword(userData.password)

  // Stwórz użytkownika
  const [newUser] = await db
    .insert(users)
    .values({
      ...userData,
      password: hashedPassword,
    })
    .returning()

  // Usuń hasło z zwróconego obiektu
  const { password, ...userWithoutPassword } = newUser
  const token = generateToken(newUser.id)

  return { user: userWithoutPassword as User, token }
}

export async function loginUser(loginData: LoginData): Promise<{ user: User; token: string }> {
  // Znajdź użytkownika
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, loginData.username))
    .limit(1)

  if (!user) {
    throw new Error('Nieprawidłowy login lub hasło')
  }

  // Sprawdź hasło
  const isValidPassword = await verifyPassword(loginData.password, user.password)
  
  if (!isValidPassword) {
    throw new Error('Nieprawidłowy login lub hasło')
  }

  // Usuń hasło z zwróconego obiektu
  const { password, ...userWithoutPassword } = user
  const token = generateToken(user.id)

  return { user: userWithoutPassword as User, token }
}

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!user) return null

  const { password, ...userWithoutPassword } = user
  return userWithoutPassword as User
}