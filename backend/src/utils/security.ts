// src/utils/security.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/environment";

export const security = {
  /**
   * Gera um hash para senha
   */
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  },

  /**
   * Verifica se a senha é válida
   */
  verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  },

  /**
   * Gera um token JWT
   */
  generateToken(payload: any, expiresIn = config.jwt.expiresIn): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
  },

  /**
   * Verifica se o token é válido
   */
  verifyToken(token: string, ignoreExpiration: boolean = false): any {
    try {
      return jwt.verify(token, config.jwt.secret, { ignoreExpiration });
    } catch (error) {
      return null;
    }
  },
};
