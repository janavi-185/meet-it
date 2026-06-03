import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../config/db.js";
import { env } from "../../config/env.js";
import { CreateUserInput, users } from "./auth.model.js";

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(input: CreateUserInput): Promise<void> {
    const { name, email, password } = input;

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password!, 10);

    // Insert user into DB
    const sql = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
    `;
    await query(sql, [name, email, hashedPassword]);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: env.jwtExpiresIn as any,
    });

    return token;
  }

  async findByEmail(email: string): Promise<users | null> {
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await query(sql, [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<users | null> {
    const sql = "SELECT * FROM users WHERE id = $1";
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }
}

