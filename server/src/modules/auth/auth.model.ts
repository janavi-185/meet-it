export interface users {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserInput = Pick<users, "name" | "email" | "password">;
