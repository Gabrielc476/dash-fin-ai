// src/routes/reports.routes.ts
import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import reportController from "../controllers/report.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { ExportFormat, ReportGroupBy } from "../types/enums";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Obter relatório de receitas vs despesas
router.get(
  "/income-expense",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      groupBy: Joi.string()
        .valid(
          ReportGroupBy.DAY,
          ReportGroupBy.WEEK,
          ReportGroupBy.MONTH,
          ReportGroupBy.QUARTER,
          ReportGroupBy.YEAR
        )
        .default(ReportGroupBy.MONTH),
    }),
  }),
  reportController.getIncomeExpenseReport
);

// Obter relatório por categoria
router.get(
  "/category",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      categoryIds: Joi.alternatives().try(
        Joi.string().pattern(/^\d+(,\d+)*$/), // String de IDs separados por vírgula
        Joi.array().items(Joi.number().integer())
      ),
    }),
  }),
  reportController.getCategoryReport
);

// Exportar dados
router.get(
  "/export",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      format: Joi.string()
        .valid(ExportFormat.CSV, ExportFormat.EXCEL, ExportFormat.JSON)
        .required(),
    }),
  }),
  reportController.exportData
);

// Obter tendências financeiras
router.get(
  "/trends",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      months: Joi.number().integer().min(2).max(24).default(6),
    }),
  }),
  reportController.getTrends
);

export default router;
