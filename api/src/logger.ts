import { format, createLogger, transports } from "winston";
import * as winston from "winston";
import fs from "fs";
import path from "path";

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
  ],
});
