// src/routes/transactions.routes.ts
import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import transactionController from "../controllers/transaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para resumos devem ser definidas antes das rotas com parâmetros
// para evitar conflitos de roteamento

// Obter resumo de gastos por categoria
router.get(
  "/resumo/categorias",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
    }),
  }),
  transactionController.getExpenseSummaryByCategory
);

// Obter resumo mensal
router.get(
  "/resumo/mensal",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
    }),
  }),
  transactionController.getMonthlySummary
);

// Criar transação
router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      description: Joi.string().required(),
      amount: Joi.number().positive().required(),
      date: Joi.date().iso().required(),
      categoryId: Joi.number().integer().required(),
      isExpense: Joi.boolean().default(true),
      paymentMethod: Joi.string().allow(null, ""),
      notes: Joi.string().allow(null, ""),
      tags: Joi.array().items(Joi.string()),
    }),
  }),
  transactionController.create
);

// Listar transações
router.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1).max(100),
      startDate: Joi.string(),
      endDate: Joi.string(),
    }),
  }),
  transactionController.list
);

// Obter transação por ID
router.get(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  transactionController.getById
);

// Atualizar transação
router.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object()
      .keys({
        description: Joi.string(),
        amount: Joi.number().positive(),
        date: Joi.date().iso(),
        categoryId: Joi.number().integer(),
        isExpense: Joi.boolean(),
        paymentMethod: Joi.string().allow(null, ""),
        notes: Joi.string().allow(null, ""),
        tags: Joi.array().items(Joi.string()),
      })
      .min(1),
  }),
  transactionController.update
);

// Deletar transação
router.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  transactionController.delete
);

export default router;
