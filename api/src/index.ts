import express from "express";
import cors from "cors";
import { listBookLoans } from "./endpoints/listBookLoans";
import figlet from "figlet";
import chalk from "chalk";
import { logger } from "./logger";

const API_PORT = 8080;
const api = express();

api.use(cors({ origin: "*" }));

api.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.send("API is up");
});

api.get("/book-loans", (req, res) => {
  logger.info("Book loans endpoint accessed");
  return listBookLoans(req, res);
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
