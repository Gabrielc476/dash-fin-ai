// src/types/request.d.ts
import { Request } from "express";

// Estende a definição de Request do Express para incluir usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        // Outros campos do usuário que podem ser úteis
        iat?: number; // Issued at (quando o token foi emitido)
        exp?: number; // Expiration time
      };
    }
  }
}
