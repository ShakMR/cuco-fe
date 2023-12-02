import type { Level } from "pino";
import pino from "pino";

export const LoggerFactory = {
  get: (name: string, level: Level = "info") => pino({ level, name }),
};
