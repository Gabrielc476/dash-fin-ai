// src/services/budget.service.ts
import { NotFoundError, BadRequestError } from "../utils/errors";
import budgetRepository from "../repositories/budget.repository";
import categoryRepository from "../repositories/category.repository";
import { BudgetCreateDto, BudgetUpdateDto } from "../types/models";
import { isAfter, isBefore } from "date-fns";

class BudgetService {
  /**
   * Cria um novo orçamento
   */
  async createBudget(userId: number, budgetData: BudgetCreateDto) {
    // Validar datas
    const { startDate, endDate, categoryIds } = budgetData;

    if (isAfter(startDate, endDate)) {
      throw new BadRequestError(
        "A data de início deve ser anterior à data de término"
      );
    }

    // Verificar se as categorias existem e pertencem ao usuário
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        const category = await categoryRepository.findById(categoryId, userId);
        if (!category) {
          throw new BadRequestError(
            `Categoria com ID ${categoryId} não encontrada`
          );
        }

        // Verificar se a categoria é do tipo despesa
        if (!category.isExpense) {
          throw new BadRequestError(
            "Orçamentos só podem ser criados para categorias de despesa"
          );
        }
      }
    } else {
      throw new BadRequestError(
        "Pelo menos uma categoria deve ser selecionada"
      );
    }

    return budgetRepository.create(userId, budgetData);
  }

  /**
   * Lista orçamentos do usuário
   */
  async listUserBudgets(
    userId: number,
    options: {
      active?: boolean;
      skip?: number;
      limit?: number;
    } = {}
  ) {
    return budgetRepository.findByUser(userId, options);
  }

  /**
   * Obtém um orçamento específico
   */
  async getBudget(id: number, userId: number) {
    const budget = await budgetRepository.findById(id, userId);

    if (!budget) {
      throw new NotFoundError("Orçamento não encontrado");
    }

    return budget;
  }

  /**
   * Atualiza um orçamento
   */
  async updateBudget(id: number, userId: number, data: BudgetUpdateDto) {
    // Validar datas, se fornecidas
    if (data.startDate && data.endDate) {
      if (isAfter(data.startDate, data.endDate)) {
        throw new BadRequestError(
          "A data de início deve ser anterior à data de término"
        );
      }
    } else if (data.startDate) {
      // Se apenas startDate for fornecida, verificar com endDate existente
      const budget = await budgetRepository.findById(id, userId);
      if (budget && isAfter(data.startDate, budget.endDate)) {
        throw new BadRequestError(
          "A data de início deve ser anterior à data de término"
        );
      }
    } else if (data.endDate) {
      // Se apenas endDate for fornecida, verificar com startDate existente
      const budget = await budgetRepository.findById(id, userId);
      if (budget && isBefore(data.endDate, budget.startDate)) {
        throw new BadRequestError(
          "A data de término deve ser posterior à data de início"
        );
      }
    }

    // Verificar se as categorias existem e pertencem ao usuário, se fornecidas
    if (data.categoryIds && data.categoryIds.length > 0) {
      for (const categoryId of data.categoryIds) {
        const category = await categoryRepository.findById(categoryId, userId);
        if (!category) {
          throw new BadRequestError(
            `Categoria com ID ${categoryId} não encontrada`
          );
        }

        // Verificar se a categoria é do tipo despesa
        if (!category.isExpense) {
          throw new BadRequestError(
            "Orçamentos só podem ser criados para categorias de despesa"
          );
        }
      }
    }

    const updatedBudget = await budgetRepository.update(id, userId, data);

    if (!updatedBudget) {
      throw new NotFoundError("Orçamento não encontrado");
    }

    return updatedBudget;
  }

  /**
   * Remove um orçamento
   */
  async deleteBudget(id: number, userId: number) {
    const deleted = await budgetRepository.delete(id, userId);

    if (!deleted) {
      throw new NotFoundError("Orçamento não encontrado");
    }

    return true;
  }

  /**
   * Obtém o progresso de um orçamento
   */
  async getBudgetProgress(id: number, userId: number) {
    const progress = await budgetRepository.getBudgetProgress(id, userId);

    if (!progress) {
      throw new NotFoundError("Orçamento não encontrado");
    }

    return progress;
  }
}

export default new BudgetService();
