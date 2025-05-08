// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { security } from "../utils/security";
import { UnauthorizedError } from "../utils/errors";

/**
 * Middleware de autenticação que verifica se o token JWT é válido
 * e extrai informações do usuário para a requisição
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obter o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Token não fornecido");
    }

    // Formato esperado: "Bearer [token]"
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      throw new UnauthorizedError("Erro no formato do token");
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new UnauthorizedError("Token malformatado");
    }

    // Verificar se o token é válido
    const decoded = security.verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedError("Token inválido ou expirado");
    }

    // Adicionar informações do usuário na requisição
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    return next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return next(error);
    }

    return next(new UnauthorizedError("Não autorizado"));
  }
};
