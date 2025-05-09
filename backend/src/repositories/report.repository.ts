// src/repositories/report.repository.ts
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/database";
import transactionRepository from "./transaction.repository";

class ReportRepository {
  /**
   * Obtém resumo de transações agrupadas por período específico
   */
  async getTransactionSummaryByPeriod(
    userId: number,
    startDate: Date,
    endDate: Date,
    periodFormat: string = "YYYY-MM"
  ): Promise<any[]> {
    // Consulta SQL que agrupa transações pelo período especificado
    // O formato do período é definido pela função TO_CHAR do PostgreSQL
    const result = await sequelize.query(
      `
      SELECT 
        TO_CHAR(t.date, :periodFormat) as period,
        SUM(CASE WHEN t.is_expense = true THEN t.amount ELSE 0 END) as expenses,
        SUM(CASE WHEN t.is_expense = false THEN t.amount ELSE 0 END) as incomes,
        COUNT(*) as total_transactions
      FROM 
        transactions t
      WHERE 
        t.user_id = :userId 
        AND t.date BETWEEN :startDate AND :endDate
      GROUP BY 
        TO_CHAR(t.date, :periodFormat)
      ORDER BY 
        period ASC
    `,
      {
        replacements: {
          userId,
          startDate,
          endDate,
          periodFormat,
        },
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }

  /**
   * Obtém detalhes de transações para exportação
   */
  async getTransactionsForExport(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    // Este método pode ser estendido para incluir dados adicionais ou formatações específicas
    // para exportação, mas por hora usamos o repository de transações existente
    return transactionRepository.findByPeriod(userId, startDate, endDate);
  }

  /**
   * Obtém resumo de gastos mensais por ano
   */
  async getMonthlyExpensesByYear(userId: number, year: number): Promise<any[]> {
    const result = await sequelize.query(
      `
      SELECT
        EXTRACT(MONTH FROM t.date) as month,
        SUM(t.amount) as total
      FROM
        transactions t
      WHERE
        t.user_id = :userId
        AND t.is_expense = true
        AND EXTRACT(YEAR FROM t.date) = :year
      GROUP BY
        EXTRACT(MONTH FROM t.date)
      ORDER BY
        month ASC
    `,
      {
        replacements: {
          userId,
          year,
        },
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }

  /**
   * Obtém gastos de um usuário por categoria e por mês
   */
  async getCategoryExpensesByMonth(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    const result = await sequelize.query(
      `
      SELECT
        c.id as category_id,
        c.name as category_name,
        TO_CHAR(t.date, 'YYYY-MM') as month,
        SUM(t.amount) as total
      FROM
        transactions t
      JOIN
        categories c ON t.category_id = c.id
      WHERE
        t.user_id = :userId
        AND t.is_expense = true
        AND t.date BETWEEN :startDate AND :endDate
      GROUP BY
        c.id, c.name, TO_CHAR(t.date, 'YYYY-MM')
      ORDER BY
        c.name ASC, month ASC
    `,
      {
        replacements: {
          userId,
          startDate,
          endDate,
        },
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }

  /**
   * Obtém os gastos totais por categoria para um período específico
   */
  async getCategoryTotals(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    const result = await sequelize.query(
      `
      SELECT
        c.id as "categoryId",
        c.name as "categoryName",
        c.color as "categoryColor",
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
        c.id, c.name, c.color
      ORDER BY
        total DESC
      `,
      {
        replacements: {
          userId,
          startDate,
          endDate,
        },
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }

  /**
   * Obtém estatísticas gerais para o dashboard
   */
  async getDashboardStats(userId: number): Promise<any> {
    // Obter o mês atual
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Obter o mês anterior
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Consulta para estatísticas do mês atual
    const currentMonthStats = await sequelize.query(
      `
      SELECT
        SUM(CASE WHEN t.is_expense = true THEN t.amount ELSE 0 END) as expenses,
        SUM(CASE WHEN t.is_expense = false THEN t.amount ELSE 0 END) as incomes,
        COUNT(*) as transaction_count
      FROM
        transactions t
      WHERE
        t.user_id = :userId
        AND t.date BETWEEN :startDate AND :endDate
      `,
      {
        replacements: {
          userId,
          startDate: currentMonthStart,
          endDate: currentMonthEnd,
        },
        type: QueryTypes.SELECT,
      }
    );

    // Consulta para estatísticas do mês anterior
    const lastMonthStats = await sequelize.query(
      `
      SELECT
        SUM(CASE WHEN t.is_expense = true THEN t.amount ELSE 0 END) as expenses,
        SUM(CASE WHEN t.is_expense = false THEN t.amount ELSE 0 END) as incomes,
        COUNT(*) as transaction_count
      FROM
        transactions t
      WHERE
        t.user_id = :userId
        AND t.date BETWEEN :startDate AND :endDate
      `,
      {
        replacements: {
          userId,
          startDate: lastMonthStart,
          endDate: lastMonthEnd,
        },
        type: QueryTypes.SELECT,
      }
    );

    return {
      currentMonth: {
        period: {
          startDate: currentMonthStart,
          endDate: currentMonthEnd,
        },
        stats: currentMonthStats[0] || {
          expenses: 0,
          incomes: 0,
          transaction_count: 0,
        },
      },
      lastMonth: {
        period: {
          startDate: lastMonthStart,
          endDate: lastMonthEnd,
        },
        stats: lastMonthStats[0] || {
          expenses: 0,
          incomes: 0,
          transaction_count: 0,
        },
      },
    };
  }
}

export default new ReportRepository();
