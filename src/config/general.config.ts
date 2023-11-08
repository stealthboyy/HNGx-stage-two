import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "./.env"),
});

export const Config = {
  appEnv: process.env.APP_ENV || "DEVELOPMENT",

  port: parseInt(process.env.PORT!) || 5500,

  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  dbUrl: process.env.DATABASE_URL,
};
