// src/routes/ai-insights.routes.ts
import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import aiInsightController from "../controllers/ai-insight.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar insights
router.get(
  "/insights",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(100),
      offset: Joi.number().integer().min(0),
      type: Joi.string(),
      minRelevance: Joi.number().min(0).max(10),
    }),
  }),
  aiInsightController.listInsights
);

// Gerar novos insights
router.post("/insights/generate", aiInsightController.generateInsights);

// Obter insight por ID
router.get(
  "/insights/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  aiInsightController.getInsightById
);

// Obter insights por categoria
router.get(
  "/insights/category/:categoryId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      categoryId: Joi.number().integer().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(20),
    }),
  }),
  aiInsightController.getInsightsByCategory
);

// Obter recomendação para transação
router.post(
  "/recommendation/transaction",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      description: Joi.string().required(),
      amount: Joi.number().required(),
      categoryId: Joi.number().integer().required(),
      date: Joi.date().iso(),
      isExpense: Joi.boolean().default(true),
    }),
  }),
  aiInsightController.getTransactionRecommendation
);

// Gerar previsão de gastos
router.get(
  "/forecast",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      months: Joi.number().integer().min(1).max(12).default(3),
    }),
  }),
  aiInsightController.generateForecast
);

// Gerar análise de saúde financeira
router.get("/health-check", aiInsightController.generateHealthCheck);

export default router;
