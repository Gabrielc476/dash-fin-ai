// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import userRepository from "../repositories/user.repository";
import { security } from "../utils/security";
import { UserCreateDto } from "../types/models";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../utils/errors";

export default {
  /**
   * Registra um novo usuário
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Verificar se o email já está em uso
      const existingUser = await userRepository.findByEmail(email);

      if (existingUser) {
        throw new BadRequestError("Este email já está em uso");
      }

      // Criar hash da senha
      const passwordHash = security.hashPassword(password);

      // Criar o usuário
      const userData: UserCreateDto = {
        name,
        email,
        password: passwordHash,
      };

      const user = await userRepository.create(userData);

      // Gerar token JWT
      const token = security.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // Resposta sem expor dados sensíveis
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Autentica um usuário existente
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Buscar usuário pelo email
      const user = await userRepository.findByEmail(email);

      if (!user) {
        throw new UnauthorizedError("Credenciais inválidas");
      }

      // Verificar senha
      const isPasswordValid = security.verifyPassword(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError("Credenciais inválidas");
      }

      // Gerar token JWT
      const token = security.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // Resposta sem expor dados sensíveis
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Renova o token JWT
   */
  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Verificar se o token é válido (mesmo expirado)
      const decoded = security.verifyToken(refreshToken, true);

      if (!decoded || !decoded.id) {
        throw new UnauthorizedError("Token inválido");
      }

      // Buscar usuário pelo ID
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      // Gerar novo token JWT
      const newToken = security.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // Resposta com novo token
      res.json({
        token: newToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Retorna informações do usuário autenticado
   */
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new UnauthorizedError("Não autorizado");
      }

      // Buscar usuário pelo ID
      const user = await userRepository.findById(userId);

      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      // Resposta sem expor dados sensíveis
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      });
    } catch (error) {
      next(error);
    }
  },
};
