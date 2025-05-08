// src/utils/errors.ts
/**
 * Classe de erro base para erros personalizados do aplicativo
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capturar stack trace (especificando esta classe como origem do erro)
    Error.captureStackTrace(this, this.constructor);

    // Definir nome da classe como nome do erro
    this.name = this.constructor.name;
  }
}

/**
 * Erro 400 - Bad Request
 * Usado quando a solicitação contém parâmetros inválidos ou malformados
 */
export class BadRequestError extends AppError {
  constructor(message = "Requisição inválida") {
    super(message, 400);
  }
}

/**
 * Erro 401 - Unauthorized
 * Usado quando há falha na autenticação ou credenciais inválidas
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
  }
}

/**
 * Erro 403 - Forbidden
 * Usado quando o usuário não tem permissão para acessar o recurso
 */
export class ForbiddenError extends AppError {
  constructor(message = "Acesso proibido") {
    super(message, 403);
  }
}

/**
 * Erro 404 - Not Found
 * Usado quando o recurso solicitado não é encontrado
 */
export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

/**
 * Erro 409 - Conflict
 * Usado quando há conflito com o estado atual do recurso
 */
export class ConflictError extends AppError {
  constructor(message = "Conflito de recursos") {
    super(message, 409);
  }
}

/**
 * Erro 422 - Unprocessable Entity
 * Usado quando a solicitação está semanticamente correta, mas não pode ser processada
 */
export class ValidationError extends AppError {
  constructor(message = "Erro de validação") {
    super(message, 422);
  }
}

/**
 * Erro 500 - Internal Server Error
 * Usado para erros internos não tratados
 */
export class InternalServerError extends AppError {
  constructor(message = "Erro interno do servidor") {
    super(message, 500, false);
  }
}

/**
 * Erro 503 - Service Unavailable
 * Usado quando um serviço externo não está disponível
 */
export class ServiceUnavailableError extends AppError {
  constructor(message = "Serviço indisponível") {
    super(message, 503);
  }
}
