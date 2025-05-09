// src/repositories/insight.repository.ts
import { Op } from "sequelize";
import Insight from "../models/insight.model";
import Category from "../models/category.model";
import { InsightCreateDto } from "../types/models";

class InsightRepository {
  /**
   * Cria um novo insight
   */
  async create(insightData: {
    userId: number;
    type: string;
    title: string;
    description: string;
    impactValue?: number;
    relevanceScore: number;
    categoryIds?: number[];
  }): Promise<Insight> {
    const { categoryIds, ...data } = insightData;

    // Criar o insight
    const insight = await Insight.create(data);

    // Associar categorias se fornecidas
    if (categoryIds && categoryIds.length > 0) {
      await insight.setCategories(categoryIds);
    }

    // Buscar o insight completo com suas categorias
    const createdInsight = await this.findById(insight.id);
    if (!createdInsight) {
      throw new Error("Falha ao criar insight");
    }

    return createdInsight;
  }

  /**
   * Obtém um insight por ID
   */
  async findById(id: number): Promise<Insight | null> {
    return Insight.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: "categories",
        },
      ],
    });
  }

  /**
   * Lista todos os insights de um usuário
   */
  async findByUser(
    userId: number,
    options: {
      limit?: number;
      offset?: number;
      type?: string;
      minRelevance?: number;
    } = {}
  ): Promise<Insight[]> {
    const { limit = 20, offset = 0, type, minRelevance } = options;

    // Construir condições de busca
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (minRelevance) {
      where.relevanceScore = { [Op.gte]: minRelevance };
    }

    return Insight.findAll({
      where,
      include: [
        {
          model: Category,
          as: "categories",
        },
      ],
      order: [["relevanceScore", "DESC"]],
      limit,
      offset,
    });
  }

  /**
   * Remove insights antigos para um usuário
   * Mantém apenas os insights mais recentes e relevantes
   */
  async pruneOldInsights(
    userId: number,
    keepCount: number = 50
  ): Promise<number> {
    // Buscar IDs de insights a manter (os mais recentes)
    const insightsToKeep = await Insight.findAll({
      where: { userId },
      order: [
        ["createdAt", "DESC"],
        ["relevanceScore", "DESC"],
      ],
      limit: keepCount,
      attributes: ["id"],
    });

    const idsToKeep = insightsToKeep.map((insight) => insight.id);

    // Remover insights que não estão na lista de IDs a manter
    const result = await Insight.destroy({
      where: {
        userId,
        id: { [Op.notIn]: idsToKeep },
      },
    });

    return result;
  }

  /**
   * Obtém insights relacionados a uma categoria específica
   */
  async findByCategoryId(
    userId: number,
    categoryId: number,
    limit: number = 5
  ): Promise<Insight[]> {
    const insights = await Insight.findAll({
      include: [
        {
          model: Category,
          as: "categories",
          where: { id: categoryId },
        },
      ],
      where: { userId },
      order: [["relevanceScore", "DESC"]],
      limit,
    });

    return insights;
  }
}

export default new InsightRepository();
