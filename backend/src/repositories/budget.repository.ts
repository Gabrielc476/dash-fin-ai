// src/repositories/budget.repository.ts
import { Op, QueryTypes } from "sequelize";
import Budget from "../models/budget.model";
import Category from "../models/category.model";
import { BudgetCreateDto, BudgetUpdateDto } from "../types/models";
import { sequelize } from "../config/database";

class BudgetRepository {
  /**
   * Cria um novo orçamento
   */
  async create(userId: number, budgetData: BudgetCreateDto): Promise<Budget> {
    // Criar o orçamento
    const budget = await Budget.create({
      ...budgetData,
      userId,
    });

    // Adicionar categorias associadas
    if (budgetData.categoryIds && budgetData.categoryIds.length > 0) {
      await budget.setCategories(budgetData.categoryIds);
    }

    // Buscar o orçamento completo com suas categorias
    const createdBudget = await this.findById(budget.id, userId);
    if (!createdBudget) {
      throw new Error("Falha ao criar orçamento");
    }

    return createdBudget;
  }

  /**
   * Obtém um orçamento por ID
   */
  async findById(id: number, userId: number): Promise<Budget | null> {
    return Budget.findOne({
      where: {
        id,
        userId,
      },
      include: [
        {
          model: Category,
          as: "categories",
        },
      ],
    });
  }

  /**
   * Lista todos os orçamentos de um usuário
   */
  async findByUser(
    userId: number,
    options: {
      active?: boolean;
      skip?: number;
      limit?: number;
    } = {}
  ): Promise<Budget[]> {
    const { active, skip = 0, limit = 100 } = options;

    const where: any = { userId };

    // Filtrar apenas os orçamentos ativos, se solicitado
    if (active) {
      const now = new Date();
      where.startDate = { [Op.lte]: now };
      where.endDate = { [Op.gte]: now };
    }

    return Budget.findAll({
      where,
      include: [
        {
          model: Category,
          as: "categories",
        },
      ],
      order: [["startDate", "DESC"]],
      offset: skip,
      limit,
    });
  }

  /**
   * Obtém orçamentos ativos do usuário
   */
  async findActiveByUser(userId: number): Promise<Budget[]> {
    return this.findByUser(userId, { active: true });
  }

  /**
   * Atualiza um orçamento
   */
  async update(
    id: number,
    userId: number,
    data: BudgetUpdateDto
  ): Promise<Budget | null> {
    // Verificar se o orçamento existe
    const budget = await this.findById(id, userId);

    if (!budget) {
      return null;
    }

    // Extrair categoryIds do data
    const { categoryIds, ...budgetData } = data;

    // Atualizar o orçamento
    await budget.update(budgetData);

    // Atualizar categorias associadas, se fornecidas
    if (categoryIds) {
      await budget.setCategories(categoryIds);
    }

    // Buscar o orçamento atualizado com suas categorias
    return this.findById(id, userId);
  }

  /**
   * Remove um orçamento
   */
  async delete(id: number, userId: number): Promise<boolean> {
    const result = await Budget.destroy({
      where: {
        id,
        userId,
      },
    });

    return result > 0;
  }

  /**
   * Obtém o progresso de um orçamento
   */
  async getBudgetProgress(id: number, userId: number): Promise<any> {
    const budget = await this.findById(id, userId);

    if (!budget) {
      return null;
    }

    // Obter categorias do orçamento usando o método de associação gerado pelo Sequelize
    const categories = await budget.getCategories();
    const categoryIds = categories.map((category) => category.id);

    // Usar SQL bruto para calcular a soma de gastos nas categorias do orçamento
    const query = `
      SELECT 
        SUM(t.amount) as spent
      FROM 
        transactions t
      WHERE 
        t.user_id = :userId 
        AND t.category_id IN (:categoryIds)
        AND t.is_expense = true
        AND t.date BETWEEN :startDate AND :endDate
    `;

    const [results] = await sequelize.query(query, {
      replacements: {
        userId,
        categoryIds,
        startDate: budget.startDate,
        endDate: budget.endDate,
      },
      type: QueryTypes.SELECT,
    });

    const spent = results ? Number(results.spent) || 0 : 0;
    const budgetAmount = Number(budget.amount);

    return {
      budget: {
        id: budget.id,
        name: budget.name,
        amount: budgetAmount,
        startDate: budget.startDate,
        endDate: budget.endDate,
        recurrence: budget.recurrence,
        categories: categories,
      },
      progress: {
        spent,
        remaining: budgetAmount - spent,
        percentage: (spent / budgetAmount) * 100,
        isOverBudget: spent > budgetAmount,
      },
    };
  }
}

export default new BudgetRepository();
