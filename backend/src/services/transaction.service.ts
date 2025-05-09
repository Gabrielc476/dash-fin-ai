// src/services/transaction.service.ts
import { NotFoundError, BadRequestError } from "../utils/errors";
import transactionRepository from "../repositories/transaction.repository";
import categoryRepository from "../repositories/category.repository";
import { TransactionCreateDto, TransactionUpdateDto } from "../types/models";

class TransactionService {
  /**
   * Cria uma nova transação
   */
  async createTransaction(
    userId: number,
    transactionData: TransactionCreateDto
  ) {
    // Verificar se a categoria existe para este usuário
    const category = await categoryRepository.findById(
      transactionData.categoryId,
      userId
    );

    if (!category) {
      throw new BadRequestError("Categoria não encontrada");
    }

    // Verificar se o tipo da transação corresponde ao tipo da categoria
    if (category.isExpense !== transactionData.isExpense) {
      throw new BadRequestError(
        `Esta categoria é do tipo ${
          category.isExpense ? "despesa" : "receita"
        }, mas a transação é do tipo ${
          transactionData.isExpense ? "despesa" : "receita"
        }`
      );
    }

    return transactionRepository.create(userId, transactionData);
  }

  /**
   * Lista transações do usuário
   */
  async listUserTransactions(
    userId: number,
    options: {
      skip?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    return transactionRepository.findByUser(userId, options);
  }

  /**
   * Obtém uma transação específica
   */
  async getTransaction(id: number, userId: number) {
    const transaction = await transactionRepository.findById(id, userId);

    if (!transaction) {
      throw new NotFoundError("Transação não encontrada");
    }

    return transaction;
  }

  /**
   * Atualiza uma transação
   */
  async updateTransaction(
    id: number,
    userId: number,
    data: TransactionUpdateDto
  ) {
    // Verificar se a categoria foi atualizada e se existe
    if (data.categoryId) {
      const category = await categoryRepository.findById(
        data.categoryId,
        userId
      );
      if (!category) {
        throw new BadRequestError("Categoria não encontrada");
      }

      // Se o tipo da transação está sendo alterado, verificar compatibilidade com a categoria
      if (
        data.isExpense !== undefined &&
        category.isExpense !== data.isExpense
      ) {
        throw new BadRequestError(
          `Esta categoria é do tipo ${
            category.isExpense ? "despesa" : "receita"
          }, mas a transação é do tipo ${
            data.isExpense ? "despesa" : "receita"
          }`
        );
      } else if (data.isExpense === undefined) {
        // Se o tipo da transação não está sendo alterado, verificar com o valor atual
        const transaction = await transactionRepository.findById(id, userId);
        if (transaction && category.isExpense !== transaction.isExpense) {
          throw new BadRequestError(
            `Esta categoria é do tipo ${
              category.isExpense ? "despesa" : "receita"
            }, mas a transação é do tipo ${
              transaction.isExpense ? "despesa" : "receita"
            }`
          );
        }
      }
    }

    const updatedTransaction = await transactionRepository.update(
      id,
      userId,
      data
    );

    if (!updatedTransaction) {
      throw new NotFoundError("Transação não encontrada");
    }

    return updatedTransaction;
  }

  /**
   * Remove uma transação
   */
  async deleteTransaction(id: number, userId: number) {
    const deleted = await transactionRepository.delete(id, userId);

    if (!deleted) {
      throw new NotFoundError("Transação não encontrada");
    }

    return true;
  }

  /**
   * Obtém transações por período
   */
  async getTransactionsByPeriod(
    userId: number,
    startDate: Date,
    endDate: Date
  ) {
    return transactionRepository.findByPeriod(userId, startDate, endDate);
  }

  /**
   * Obtém resumo de gastos por categoria
   */
  async getExpenseSummaryByCategory(
    userId: number,
    startDate: Date,
    endDate: Date
  ) {
    return transactionRepository.getExpenseSummaryByCategory(
      userId,
      startDate,
      endDate
    );
  }

  /**
   * Obtém resumo mensal de despesas e receitas
   */
  async getMonthlySummary(userId: number, startDate: Date, endDate: Date) {
    return transactionRepository.getMonthlySummary(userId, startDate, endDate);
  }
}

export default new TransactionService();
