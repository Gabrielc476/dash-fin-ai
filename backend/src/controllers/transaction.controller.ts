// src/controllers/transaction.controller.ts
import { Request, Response, NextFunction } from "express";
import transactionService from "../services/transaction.service";
import { parseISO } from "date-fns";

export default {
  /**
   * Cria uma nova transação
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      // Processar datas se vieram como string
      if (req.body.date && typeof req.body.date === "string") {
        req.body.date = parseISO(req.body.date);
      }

      const transaction = await transactionService.createTransaction(
        userId,
        req.body
      );

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Lista transações do usuário
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const { skip, limit, startDate, endDate } = req.query;

      // Processar datas se existirem
      let startDateObj, endDateObj;

      if (startDate && endDate) {
        startDateObj =
          typeof startDate === "string" ? parseISO(startDate) : undefined;
        endDateObj =
          typeof endDate === "string" ? parseISO(endDate) : undefined;
      }

      const transactions = await transactionService.listUserTransactions(
        userId,
        {
          skip: skip ? parseInt(skip as string, 10) : undefined,
          limit: limit ? parseInt(limit as string, 10) : undefined,
          startDate: startDateObj,
          endDate: endDateObj,
        }
      );

      res.json(transactions);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém uma transação específica
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const transaction = await transactionService.getTransaction(
        parseInt(id, 10),
        userId
      );

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza uma transação
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      // Processar datas se vieram como string
      if (req.body.date && typeof req.body.date === "string") {
        req.body.date = parseISO(req.body.date);
      }

      const transaction = await transactionService.updateTransaction(
        parseInt(id, 10),
        userId,
        req.body
      );

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove uma transação
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      await transactionService.deleteTransaction(parseInt(id, 10), userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém resumo de gastos por categoria
   */
  async getExpenseSummaryByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      if (!startDate || !endDate) {
        res
          .status(400)
          .json({ message: "Data inicial e final são obrigatórias" });
        return;
      }

      const startDateObj =
        typeof startDate === "string" ? parseISO(startDate) : new Date();
      const endDateObj =
        typeof endDate === "string" ? parseISO(endDate) : new Date();

      const summary = await transactionService.getExpenseSummaryByCategory(
        userId,
        startDateObj,
        endDateObj
      );

      res.json(summary);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém resumo mensal de despesas e receitas
   */
  async getMonthlySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      if (!startDate || !endDate) {
        res
          .status(400)
          .json({ message: "Data inicial e final são obrigatórias" });
        return;
      }

      const startDateObj =
        typeof startDate === "string" ? parseISO(startDate) : new Date();
      const endDateObj =
        typeof endDate === "string" ? parseISO(endDate) : new Date();

      const summary = await transactionService.getMonthlySummary(
        userId,
        startDateObj,
        endDateObj
      );

      res.json(summary);
    } catch (error) {
      next(error);
    }
  },
};
