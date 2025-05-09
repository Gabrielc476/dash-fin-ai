// src/controllers/ai-insight.controller.ts
import { Request, Response, NextFunction } from "express";
import aiService from "../services/ai.service";
import insightRepository from "../repositories/insight.repository";
import { NotFoundError, BadRequestError } from "../utils/errors";

export default {
  /**
   * Gera novos insights usando IA
   */
  async generateInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const insights = await aiService.generateInsights(userId);

      res.status(201).json({
        message: "Insights gerados com sucesso",
        count: insights.length,
        insights,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Lista insights existentes
   */
  async listInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { limit, offset, type, minRelevance } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const insights = await insightRepository.findByUser(userId, {
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
        type: type as string,
        minRelevance: minRelevance
          ? parseFloat(minRelevance as string)
          : undefined,
      });

      res.json(insights);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém um insight específico por ID
   */
  async getInsightById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const insight = await insightRepository.findById(parseInt(id, 10));

      if (!insight || insight.userId !== userId) {
        throw new NotFoundError("Insight não encontrado");
      }

      res.json(insight);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém insights relacionados a uma categoria
   */
  async getInsightsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { categoryId } = req.params;
      const { limit } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      if (!categoryId) {
        throw new BadRequestError("ID da categoria é obrigatório");
      }

      const insights = await insightRepository.findByCategoryId(
        userId,
        parseInt(categoryId, 10),
        limit ? parseInt(limit as string, 10) : 5
      );

      res.json(insights);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém recomendação para uma transação específica
   */
  async getTransactionRecommendation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const transactionData = req.body;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      // Validar dados mínimos da transação
      if (
        !transactionData ||
        !transactionData.amount ||
        !transactionData.categoryId
      ) {
        throw new BadRequestError(
          "Dados insuficientes para gerar recomendação"
        );
      }

      const recommendation = await aiService.getTransactionRecommendation(
        userId,
        transactionData
      );

      res.json(recommendation);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Gera previsões de gastos futuros
   */
  async generateForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { months } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const monthsCount = months ? parseInt(months as string, 10) : 3;

      if (monthsCount < 1 || monthsCount > 12) {
        throw new BadRequestError("O número de meses deve estar entre 1 e 12");
      }

      const forecast = await aiService.generateForecast(userId, monthsCount);

      res.json(forecast);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Gera análise de saúde financeira
   */
  async generateHealthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const healthCheck = await aiService.generateFinancialHealthCheck(userId);

      res.json(healthCheck);
    } catch (error) {
      next(error);
    }
  },
};
