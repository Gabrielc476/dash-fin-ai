// src/repositories/category.repository.ts
import { Op } from "sequelize";
import Category from "../models/category.model";
import { CategoryCreateDto, CategoryUpdateDto } from "../types/models";

class CategoryRepository {
  /**
   * Cria uma nova categoria
   */
  async create(
    userId: number,
    categoryData: CategoryCreateDto
  ): Promise<Category> {
    const category = await Category.create({
      ...categoryData,
      userId,
    });

    return category;
  }

  /**
   * Obtém uma categoria por ID
   */
  async findById(id: number, userId: number): Promise<Category | null> {
    return Category.findOne({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Lista todas as categorias de um usuário
   */
  async findByUser(
    userId: number,
    options: {
      onlyExpense?: boolean;
      onlyIncome?: boolean;
    } = {}
  ): Promise<Category[]> {
    const where: any = { userId };

    // Filtrar por tipo de categoria
    if (options.onlyExpense) {
      where.isExpense = true;
    } else if (options.onlyIncome) {
      where.isExpense = false;
    }

    return Category.findAll({
      where,
      order: [
        ["isDefault", "DESC"],
        ["name", "ASC"],
      ],
    });
  }

  /**
   * Verifica se uma categoria existe com o mesmo nome para o usuário
   */
  async findByName(name: string, userId: number): Promise<Category | null> {
    return Category.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
        userId,
      },
    });
  }

  /**
   * Atualiza uma categoria
   */
  async update(
    id: number,
    userId: number,
    data: CategoryUpdateDto
  ): Promise<Category | null> {
    // Verificar se a categoria existe
    const category = await this.findById(id, userId);

    if (!category) {
      return null;
    }

    // Atualizar a categoria
    await category.update(data);

    // Recarregar para obter os dados atualizados
    return this.findById(id, userId);
  }

  /**
   * Remove uma categoria
   */
  async delete(id: number, userId: number): Promise<boolean> {
    const result = await Category.destroy({
      where: {
        id,
        userId,
        isDefault: false, // Impede a exclusão de categorias padrão
      },
    });

    return result > 0;
  }

  /**
   * Cria categorias padrão para um novo usuário
   */
  async createDefaultCategories(userId: number): Promise<Category[]> {
    const defaultExpenseCategories = [
      {
        name: "Alimentação",
        color: "#FF5733",
        icon: "utensils",
        isExpense: true,
        isDefault: true,
      },
      {
        name: "Moradia",
        color: "#33FF57",
        icon: "home",
        isExpense: true,
        isDefault: true,
      },
      {
        name: "Transporte",
        color: "#3357FF",
        icon: "car",
        isExpense: true,
        isDefault: true,
      },
      {
        name: "Saúde",
        color: "#FF33A8",
        icon: "heartbeat",
        isExpense: true,
        isDefault: true,
      },
      {
        name: "Educação",
        color: "#33FFC4",
        icon: "book",
        isExpense: true,
        isDefault: true,
      },
      {
        name: "Lazer",
        color: "#FFD433",
        icon: "film",
        isExpense: true,
        isDefault: true,
      },
      {
        name: "Outros",
        color: "#AAAAAA",
        icon: "tag",
        isExpense: true,
        isDefault: true,
      },
    ];

    const defaultIncomeCategories = [
      {
        name: "Salário",
        color: "#4CAF50",
        icon: "briefcase",
        isExpense: false,
        isDefault: true,
      },
      {
        name: "Investimentos",
        color: "#2196F3",
        icon: "chart-line",
        isExpense: false,
        isDefault: true,
      },
      {
        name: "Presente",
        color: "#9C27B0",
        icon: "gift",
        isExpense: false,
        isDefault: true,
      },
      {
        name: "Outros",
        color: "#607D8B",
        icon: "tag",
        isExpense: false,
        isDefault: true,
      },
    ];

    // Criar todas as categorias padrão
    const createdCategories = [];

    // Criar categorias de despesa
    for (const categoryData of defaultExpenseCategories) {
      const category = await Category.create({
        ...categoryData,
        userId,
      });
      createdCategories.push(category);
    }

    // Criar categorias de receita
    for (const categoryData of defaultIncomeCategories) {
      const category = await Category.create({
        ...categoryData,
        userId,
      });
      createdCategories.push(category);
    }

    return createdCategories;
  }
}

export default new CategoryRepository();
