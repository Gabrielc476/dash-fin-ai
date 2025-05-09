// src/services/category.service.ts
import { NotFoundError, BadRequestError } from "../utils/errors";
import categoryRepository from "../repositories/category.repository";
import { CategoryCreateDto, CategoryUpdateDto } from "../types/models";

class CategoryService {
  /**
   * Cria uma nova categoria
   */
  async createCategory(userId: number, categoryData: CategoryCreateDto) {
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await categoryRepository.findByName(
      categoryData.name,
      userId
    );

    if (existingCategory) {
      throw new BadRequestError(
        `Já existe uma categoria com o nome "${categoryData.name}"`
      );
    }

    return categoryRepository.create(userId, categoryData);
  }

  /**
   * Lista categorias do usuário
   */
  async listUserCategories(
    userId: number,
    options: {
      onlyExpense?: boolean;
      onlyIncome?: boolean;
    } = {}
  ) {
    return categoryRepository.findByUser(userId, options);
  }

  /**
   * Obtém uma categoria específica
   */
  async getCategory(id: number, userId: number) {
    const category = await categoryRepository.findById(id, userId);

    if (!category) {
      throw new NotFoundError("Categoria não encontrada");
    }

    return category;
  }

  /**
   * Atualiza uma categoria
   */
  async updateCategory(id: number, userId: number, data: CategoryUpdateDto) {
    // Verificar se está tentando atualizar para um nome que já existe
    if (data.name) {
      const existingCategory = await categoryRepository.findByName(
        data.name,
        userId
      );

      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestError(
          `Já existe uma categoria com o nome "${data.name}"`
        );
      }
    }

    const updatedCategory = await categoryRepository.update(id, userId, data);

    if (!updatedCategory) {
      throw new NotFoundError("Categoria não encontrada");
    }

    return updatedCategory;
  }

  /**
   * Remove uma categoria
   */
  async deleteCategory(id: number, userId: number) {
    // Verificar se a categoria existe antes de tentar excluir
    const category = await categoryRepository.findById(id, userId);

    if (!category) {
      throw new NotFoundError("Categoria não encontrada");
    }

    // Verificar se é uma categoria padrão
    if (category.isDefault) {
      throw new BadRequestError("Não é possível excluir categorias padrão");
    }

    const deleted = await categoryRepository.delete(id, userId);

    if (!deleted) {
      throw new BadRequestError("Não foi possível excluir a categoria");
    }

    return true;
  }

  /**
   * Cria categorias padrão para um novo usuário
   */
  async createDefaultCategories(userId: number) {
    return categoryRepository.createDefaultCategories(userId);
  }
}

export default new CategoryService();
