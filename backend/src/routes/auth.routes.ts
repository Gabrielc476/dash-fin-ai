// src/routes/auth.routes.ts
import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Registra um novo usuário
 * @access Public
 */
router.post(
  "/register",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(3).max(255),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  authController.register
);

/**
 * @route POST /api/v1/auth/login
 * @desc Autentica um usuário e retorna um token JWT
 * @access Public
 */
router.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  authController.login
);

/**
 * @route POST /api/v1/auth/refresh-token
 * @desc Renova o token JWT
 * @access Public (com token expirado)
 */
router.post(
  "/refresh-token",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  }),
  authController.refreshToken
);

/**
 * @route GET /api/v1/auth/me
 * @desc Retorna informações do usuário autenticado
 * @access Private
 */
router.get("/me", authMiddleware, authController.getCurrentUser);

export default router;
