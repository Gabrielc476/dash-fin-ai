// src/repositories/transaction.repository.ts
import { Op, QueryTypes } from "sequelize";
import Transaction from "../models/transaction.model";
import Category from "../models/category.model";
import { TransactionCreateDto, TransactionUpdateDto } from "../types/models";
import { sequelize } from "../config/database";

class TransactionRepository {
  /**
   * Cria uma nova transação
   */
  async create(
    userId: number,
    transactionData: TransactionCreateDto
  ): Promise<Transaction> {
    const transaction = await Transaction.create({
      ...transactionData,
      userId,
    });

    return transaction;
  }

  /**
   * Obtém uma transação por ID
   */
  async findById(id: number, userId: number): Promise<Transaction | null> {
    return Transaction.findOne({
      where: {
        id,
        userId,
      },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
  }

  /**
   * Lista todas as transações de um usuário
   */
  async findByUser(
    userId: number,
    options: {
      skip?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<Transaction[]> {
    const { skip = 0, limit = 100, startDate, endDate } = options;

    const where: any = { userId };

    // Adicionar filtro de data se fornecido
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    return Transaction.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      order: [["date", "DESC"]],
      offset: skip,
      limit,
    });
  }

  /**
   * Atualiza uma transação
   */
  async update(
    id: number,
    userId: number,
    data: TransactionUpdateDto
  ): Promise<Transaction | null> {
    // Verificar se a transação existe
    const transaction = await this.findById(id, userId);

    if (!transaction) {
      return null;
    }

    // Atualizar a transação
    await transaction.update(data);

    // Recarregar para obter os dados atualizados com as associações
    return this.findById(id, userId);
  }

  /**
   * Remove uma transação
   */
  async delete(id: number, userId: number): Promise<boolean> {
    const result = await Transaction.destroy({
      where: {
        id,
        userId,
      },
    });

    return result > 0;
  }

  /**
   * Obtém transações por período
   */
  async findByPeriod(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return Transaction.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      order: [["date", "DESC"]],
    });
  }

  /**
   * Obtém resumo de gastos por categoria em um período
   */
  async getExpenseSummaryByCategory(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    // Usando SQL bruto com Sequelize para agregação
    const result = await sequelize.query(
      `
      SELECT 
        c.id as "categoryId",
        c.name as "categoryName",
        c.color as "categoryColor",
        c.icon as "categoryIcon",
        SUM(t.amount) as total,
        COUNT(t.id) as count
      FROM 
        transactions t
      JOIN 
        categories c ON t.category_id = c.id
      WHERE 
        t.user_id = :userId 
        AND t.is_expense = true
        AND t.date BETWEEN :startDate AND :endDate
      GROUP BY 
        c.id, c.name, c.color, c.icon
      ORDER BY 
        total DESC
    `,
      {
        replacements: { userId, startDate, endDate },
        type: QueryTypes.SELECT, // Use QueryTypes diretamente, não sequelize.QueryTypes
      }
    );

    return result;
  }

  /**
   * Obtém resumo mensal de despesas e receitas
   */
  async getMonthlySummary(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    // Consulta SQL que agrupa transações por mês
    const result = await sequelize.query(
      `
      SELECT 
        TO_CHAR(t.date, 'YYYY-MM') as month,
        SUM(CASE WHEN t.is_expense = true THEN t.amount ELSE 0 END) as expenses,
        SUM(CASE WHEN t.is_expense = false THEN t.amount ELSE 0 END) as incomes
      FROM 
        transactions t
      WHERE 
        t.user_id = :userId 
        AND t.date BETWEEN :startDate AND :endDate
      GROUP BY 
        TO_CHAR(t.date, 'YYYY-MM')
      ORDER BY 
        month ASC
    `,
      {
        replacements: { userId, startDate, endDate },
        type: QueryTypes.SELECT, // Use QueryTypes diretamente, não sequelize.QueryTypes
      }
    );

    return result;
  }
}

export default new TransactionRepository();
