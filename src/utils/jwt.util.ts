import * as jwt from "jsonwebtoken";
import { Config } from "../config";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

export class JwtService {
  public signJWT(userId: string, expires?: string): Promise<string> {
    return new Promise((resolve) => {
      jwt.sign(
        { userId },
        Config.jwt.secret,
        { expiresIn: expires ? expires : Config.jwt.expiresIn },
        (error: Error, token?: string) => {
          if (error) throw error;
          return resolve(token);
        }
      );
    });
  }

  public verifyJWT(token: string): Promise<Record<string, any>> {
    return new Promise((resolve) => {
      jwt.verify(
        token,
        Config.jwt.secret,
        (
          error: JsonWebTokenError | NotBeforeError | TokenExpiredError,
          payload: any
        ) => {
          if (error) throw error;
          return resolve(payload);
        }
      );
    });
  }
}
