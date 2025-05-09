// src/routes/budgets.routes.ts
import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import budgetController from "../controllers/budget.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Criar orçamento
router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      amount: Joi.number().positive().required(),
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
      recurrence: Joi.string().valid(
        "NONE",
        "DAILY",
        "WEEKLY",
        "BIWEEKLY",
        "MONTHLY",
        "QUARTERLY",
        "SEMIANNUALLY",
        "ANNUALLY"
      ),
      categoryIds: Joi.array().items(Joi.number().integer()).min(1).required(),
    }),
  }),
  budgetController.create
);

// Listar orçamentos
router.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      active: Joi.boolean(),
      skip: Joi.number().min(0),
      limit: Joi.number().min(1).max(100),
    }),
  }),
  budgetController.list
);

// Obter orçamento por ID
router.get(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  budgetController.getById
);

// Atualizar orçamento
router.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object()
      .keys({
        name: Joi.string(),
        amount: Joi.number().positive(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        recurrence: Joi.string().valid(
          "NONE",
          "DAILY",
          "WEEKLY",
          "BIWEEKLY",
          "MONTHLY",
          "QUARTERLY",
          "SEMIANNUALLY",
          "ANNUALLY"
        ),
        categoryIds: Joi.array().items(Joi.number().integer()).min(1),
      })
      .min(1),
  }),
  budgetController.update
);

// Deletar orçamento
router.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  budgetController.delete
);

// Obter progresso do orçamento
router.get(
  "/:id/progress",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  budgetController.getProgress
);

export default router;
