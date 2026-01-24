import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";
import bookRoutes from "./routes/bookRoutes";
import userRoutes from "./routes/userRoutes";
import figlet from "figlet";
import chalk from "chalk";
import { logger } from "./logger";
import "./database/connection";

const API_PORT = 8080;
const api = express();

api.use(cors({ origin: "*" }));
api.use(express.json());
api.use("/auth", authRoutes);
api.use("/books", bookRoutes);
api.use("/loans", loanRoutes);
api.use("/users", userRoutes);

api.get("/", (req: Request, res: Response) => {
  logger.info("Root endpoint accessed");
  res.send("API is up");
});

api.listen(API_PORT, "0.0.0.0", () => {
  figlet("Desafio Forte Library", (err: Error | null, data?: string) => {
    if (err) {
      logger.error(`Error generating banner: ${err.message}`);
      return;
    }
    if (data) console.log(chalk.blue.bold(data));
  });

  logger.info(`API running on port ${API_PORT}`);
});
