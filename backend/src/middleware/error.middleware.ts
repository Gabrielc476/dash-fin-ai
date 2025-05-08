// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import { AppError } from "../utils/errors";

/**
 * Middleware global para tratamento de erros
 * Captura todos os erros lançados durante o processamento das requisições
 */
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  // Verificar se é um erro de validação do celebrate
  if (isCelebrateError(error)) {
    const validation: Record<string, string> = {};

    // Extrair todos os erros de validação
    for (const [segment, joiError] of error.details.entries()) {
      joiError.details.forEach((err) => {
        validation[err.path.join(".")] = err.message;
      });
    }

    res.status(400).json({
      status: "error",
      message: "Erro de validação",
      errors: validation,
    });
    return;
  }

  // Verificar se é um erro operacional conhecido (AppError)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  // Verificar erros de Sequelize
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    res.status(400).json({
      status: "error",
      message: "Erro de validação no banco de dados",
      errors: error.errors?.map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  // Erros desconhecidos (500 Internal Server Error)
  // Em produção, não enviamos detalhes do erro ao cliente por segurança
  const isProduction = process.env.NODE_ENV === "production";

  res.status(500).json({
    status: "error",
    message: isProduction
      ? "Erro interno do servidor"
      : error.message || "Erro interno do servidor",
    ...(isProduction ? {} : { stack: error.stack }),
  });
};

/**
 * Middleware para tratar rotas não encontradas
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    status: "error",
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
};
