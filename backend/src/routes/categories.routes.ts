// src/routes/categories.routes.ts
import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import categoryController from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Criar categoria
router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      color: Joi.string()
        .regex(/^#[0-9A-F]{6}$/i)
        .required(),
      icon: Joi.string(),
      isExpense: Joi.boolean().required(),
      isDefault: Joi.boolean(),
    }),
  }),
  categoryController.create
);

// Listar categorias
router.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      onlyExpense: Joi.boolean().default(false),
      onlyIncome: Joi.boolean().default(false),
    }),
  }),
  categoryController.list
);

// Obter categoria por ID
router.get(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  categoryController.getById
);

// Atualizar categoria
router.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object()
      .keys({
        name: Joi.string(),
        color: Joi.string().regex(/^#[0-9A-F]{6}$/i),
        icon: Joi.string().allow(null),
        isExpense: Joi.boolean(),
        isDefault: Joi.boolean(),
      })
      .min(1),
  }),
  categoryController.update
);

// Deletar categoria
router.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  categoryController.delete
);

export default router;
