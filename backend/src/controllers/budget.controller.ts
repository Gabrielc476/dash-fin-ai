// src/controllers/budget.controller.ts
import { Request, Response, NextFunction } from "express";
import budgetService from "../services/budget.service";
import { parseISO } from "date-fns";

export default {
  /**
   * Cria um novo orçamento
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      // Converter e validar as datas de forma segura
      let startDate;
      let endDate;

      try {
        if (req.body.startDate) {
          // Se for uma string ISO válida, parseISO funcionará
          if (typeof req.body.startDate === "string") {
            startDate = parseISO(req.body.startDate);
          }
          // Se for um timestamp numérico ou objeto, converte para Date
          else if (
            req.body.startDate instanceof Date ||
            typeof req.body.startDate === "number"
          ) {
            startDate = new Date(req.body.startDate);
          }
        }

        if (req.body.endDate) {
          // Se for uma string ISO válida, parseISO funcionará
          if (typeof req.body.endDate === "string") {
            endDate = parseISO(req.body.endDate);
          }
          // Se for um timestamp numérico ou objeto, converte para Date
          else if (
            req.body.endDate instanceof Date ||
            typeof req.body.endDate === "number"
          ) {
            endDate = new Date(req.body.endDate);
          }
        }
      } catch (dateError) {
        res.status(400).json({
          message:
            "Formato de data inválido. Use ISO 8601 (ex: '2025-05-01T00:00:00Z')",
        });
        return;
      }

      // Preparar dados do orçamento com datas processadas
      const budgetData = {
        ...req.body,
        startDate,
        endDate,
      };

      const budget = await budgetService.createBudget(userId, budgetData);

      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Lista orçamentos do usuário
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const { active, skip, limit } = req.query;

      const budgets = await budgetService.listUserBudgets(userId, {
        active: active === "true",
        skip: skip ? parseInt(skip as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json(budgets);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém um orçamento específico
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const budget = await budgetService.getBudget(parseInt(id, 10), userId);

      res.json(budget);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza um orçamento
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      // Converter e validar as datas de forma segura
      let startDate;
      let endDate;

      try {
        if (req.body.startDate) {
          // Se for uma string ISO válida, parseISO funcionará
          if (typeof req.body.startDate === "string") {
            startDate = parseISO(req.body.startDate);
          }
          // Se for um timestamp numérico ou objeto, converte para Date
          else if (
            req.body.startDate instanceof Date ||
            typeof req.body.startDate === "number"
          ) {
            startDate = new Date(req.body.startDate);
          }
        }

        if (req.body.endDate) {
          // Se for uma string ISO válida, parseISO funcionará
          if (typeof req.body.endDate === "string") {
            endDate = parseISO(req.body.endDate);
          }
          // Se for um timestamp numérico ou objeto, converte para Date
          else if (
            req.body.endDate instanceof Date ||
            typeof req.body.endDate === "number"
          ) {
            endDate = new Date(req.body.endDate);
          }
        }
      } catch (dateError) {
        res.status(400).json({
          message:
            "Formato de data inválido. Use ISO 8601 (ex: '2025-05-01T00:00:00Z')",
        });
        return;
      }

      // Preparar dados do orçamento com datas processadas
      const budgetData = {
        ...req.body,
        startDate,
        endDate,
      };

      const budget = await budgetService.updateBudget(
        parseInt(id, 10),
        userId,
        budgetData
      );

      res.json(budget);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove um orçamento
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      await budgetService.deleteBudget(parseInt(id, 10), userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém o progresso de um orçamento
   */
  async getProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const progress = await budgetService.getBudgetProgress(
        parseInt(id, 10),
        userId
      );

      res.json(progress);
    } catch (error) {
      next(error);
    }
  },
};
