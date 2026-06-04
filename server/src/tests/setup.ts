import { beforeAll } from "vitest";
import dotenv from "dotenv";
import path from "path";

beforeAll(() => {
  // Load .env file from the server root
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
});
