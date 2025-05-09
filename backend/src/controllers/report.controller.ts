// src/controllers/report.controller.ts
import { Request, Response, NextFunction } from "express";
import reportService from "../services/report.service";
import { parseISO } from "date-fns";
// We're using ExportFormat as string identifiers
import { ExportFormat } from "../types/enums";

export default {
  /**
   * Obtém relatório de receitas vs despesas
   */
  async getIncomeExpenseReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { startDate, endDate, groupBy } = req.query;

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

      const report = await reportService.getIncomeExpenseReport(
        userId,
        startDateObj,
        endDateObj,
        groupBy as string
      );

      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém relatório por categoria
   */
  async getCategoryReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { startDate, endDate, categoryIds } = req.query;

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

      // Processar categoryIds se existirem
      let categoryIdsArray: number[] | undefined;
      if (categoryIds) {
        if (typeof categoryIds === "string") {
          categoryIdsArray = categoryIds.split(",").map(Number);
        } else if (Array.isArray(categoryIds)) {
          categoryIdsArray = categoryIds.map(Number);
        }
      }

      const report = await reportService.getCategoryReport(
        userId,
        startDateObj,
        endDateObj,
        categoryIdsArray
      );

      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Exporta dados para o formato solicitado
   */
  async exportData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { startDate, endDate, format } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      if (!startDate || !endDate || !format) {
        res.status(400).json({
          message: "Data inicial, data final e formato são obrigatórios",
        });
        return;
      }

      const startDateObj =
        typeof startDate === "string" ? parseISO(startDate) : new Date();
      const endDateObj =
        typeof endDate === "string" ? parseISO(endDate) : new Date();
      const exportFormat = format as string;

      const { data, contentType, filename } = await reportService.exportData(
        userId,
        startDateObj,
        endDateObj,
        exportFormat
      );

      // Configurar cabeçalhos para download do arquivo
      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      res.send(data);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém tendências financeiras com base em dados históricos
   */
  async getTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { months } = req.query;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const monthsCount = months ? parseInt(months as string, 10) : 6;

      const trends = await reportService.getTrends(userId, monthsCount);

      res.json(trends);
    } catch (error) {
      next(error);
    }
  },
};
