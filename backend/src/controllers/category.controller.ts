// src/controllers/category.controller.ts
import { Request, Response, NextFunction } from "express";
import categoryService from "../services/category.service";

export default {
  /**
   * Cria uma nova categoria
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const category = await categoryService.createCategory(userId, req.body);

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Lista categorias do usuário
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const { onlyExpense, onlyIncome } = req.query;

      const categories = await categoryService.listUserCategories(userId, {
        onlyExpense: onlyExpense === "true",
        onlyIncome: onlyIncome === "true",
      });

      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtém uma categoria específica
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const category = await categoryService.getCategory(
        parseInt(id, 10),
        userId
      );

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza uma categoria
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      const category = await categoryService.updateCategory(
        parseInt(id, 10),
        userId,
        req.body
      );

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove uma categoria
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Não autorizado" });
        return;
      }

      await categoryService.deleteCategory(parseInt(id, 10), userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
