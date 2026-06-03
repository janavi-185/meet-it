import app from "./app";
import { env } from "./config/env";
import { testConnection } from "./config/db.js";

const startServer = async () => {
  try {
    // Test DB connection before starting server
    await testConnection();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
