// src/services/report.service.ts
import { BadRequestError } from "../utils/errors";
import transactionRepository from "../repositories/transaction.repository";
import reportRepository from "../repositories/report.repository";
import { ExportFormat, ReportGroupBy } from "../types/enums";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { Transaction } from "../types/models";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";

interface ExportResult {
  data: Buffer | Uint8Array | string;
  contentType: string;
  filename: string;
}

class ReportService {
  /**
   * Obtém relatório de receitas vs despesas
   */
  async getIncomeExpenseReport(
    userId: number,
    startDate: Date,
    endDate: Date,
    groupBy: string = ReportGroupBy.MONTH
  ) {
    // Validar agrupamento
    const validGroupBy = Object.values(ReportGroupBy);
    if (groupBy && !validGroupBy.includes(groupBy as ReportGroupBy)) {
      throw new BadRequestError(
        `Agrupamento inválido. Valores válidos: ${validGroupBy.join(", ")}`
      );
    }

    // Obter transações do período
    const transactions = await transactionRepository.findByPeriod(
      userId,
      startDate,
      endDate
    );

    // Agrupar transações conforme solicitado
    const groupedData = this.groupTransactions(
      transactions,
      groupBy as ReportGroupBy
    );

    // Calcular receitas, despesas e saldo para cada grupo
    const reportData = Object.keys(groupedData).map((key) => {
      const expenses = groupedData[key]
        .filter((t) => t.isExpense)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const incomes = groupedData[key]
        .filter((t) => !t.isExpense)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        period: key,
        expenses,
        incomes,
        balance: incomes - expenses,
      };
    });

    return {
      startDate,
      endDate,
      groupBy,
      data: reportData,
      summary: {
        totalExpenses: reportData.reduce((sum, item) => sum + item.expenses, 0),
        totalIncomes: reportData.reduce((sum, item) => sum + item.incomes, 0),
        totalBalance: reportData.reduce((sum, item) => sum + item.balance, 0),
      },
    };
  }

  /**
   * Obtém relatório por categoria
   */
  async getCategoryReport(
    userId: number,
    startDate: Date,
    endDate: Date,
    categoryIds?: number[]
  ) {
    // Obter resumo de gastos por categoria
    let categorySummary =
      await transactionRepository.getExpenseSummaryByCategory(
        userId,
        startDate,
        endDate
      );

    // Filtrar por categorias específicas, se fornecidas
    if (categoryIds && categoryIds.length > 0) {
      categorySummary = categorySummary.filter((summary) =>
        categoryIds.includes(summary.categoryId)
      );
    }

    // Calcular total geral
    const totalExpenses = categorySummary.reduce(
      (sum, category) => sum + Number(category.total),
      0
    );

    // Adicionar percentual em relação ao total
    const reportData = categorySummary.map((category) => ({
      ...category,
      percentage:
        totalExpenses > 0 ? (Number(category.total) / totalExpenses) * 100 : 0,
    }));

    return {
      startDate,
      endDate,
      data: reportData,
      totalExpenses,
    };
  }

  /**
   * Exporta dados para o formato solicitado
   */
  async exportData(
    userId: number,
    startDate: Date,
    endDate: Date,
    format: string
  ): Promise<ExportResult> {
    // Validar formato
    const validFormats = Object.values(ExportFormat);
    if (!validFormats.includes(format as ExportFormat)) {
      throw new BadRequestError(
        `Formato inválido. Valores válidos: ${validFormats.join(", ")}`
      );
    }

    // Obter dados de transações
    const transactions = await transactionRepository.findByPeriod(
      userId,
      startDate,
      endDate
    );

    // Preparar dados para exportação
    const exportData = transactions.map((t) => ({
      id: t.id,
      data: format ? t.date.toISOString().split("T")[0] : t.date,
      descricao: t.description,
      valor: t.amount,
      categoria: t.category ? t.category.name : "Sem categoria",
      tipo: t.isExpense ? "Despesa" : "Receita",
      metodoPagamento: t.paymentMethod || "Não especificado",
      tags: t.tags ? t.tags.join(", ") : "",
      notas: t.notes || "",
    }));

    // Exportar para o formato solicitado
    const now = new Date();
    const timestamp = format(now, "yyyyMMdd_HHmmss");
    const filenameBase = `financas_${timestamp}`;

    switch (format as ExportFormat) {
      case ExportFormat.CSV:
        return this.exportToCSV(exportData, filenameBase);
      case ExportFormat.EXCEL:
        return this.exportToExcel(exportData, filenameBase);
      case ExportFormat.JSON:
        return this.exportToJSON(exportData, filenameBase);
      default:
        throw new BadRequestError("Formato de exportação não suportado");
    }
  }

  /**
   * Obtém tendências financeiras com base em dados históricos
   */
  async getTrends(userId: number, months: number = 6) {
    // Definir período para análise de tendências
    const endDate = new Date();
    const startDate = subMonths(startOfMonth(endDate), months - 1);

    // Obter resumo mensal
    const monthlySummary = await reportRepository.getTransactionSummaryByPeriod(
      userId,
      startDate,
      endDate,
      "YYYY-MM"
    );

    // Verificar se há dados suficientes
    if (!monthlySummary || monthlySummary.length === 0) {
      return {
        message: "Dados insuficientes para análise de tendências",
        period: { startDate, endDate, months },
        monthlySummary: [],
        averages: { expenses: 0, incomes: 0, savings: 0 },
        trends: {
          expenses: { trend: 0, direction: "stable" },
          incomes: { trend: 0, direction: "stable" },
        },
        categories: [],
      };
    }

    // Calcular médias
    const avgExpenses =
      monthlySummary.reduce(
        (sum, item) => sum + Number(item.expenses || 0),
        0
      ) / monthlySummary.length;

    const avgIncomes =
      monthlySummary.reduce((sum, item) => sum + Number(item.incomes || 0), 0) /
      monthlySummary.length;

    // Calcular tendências de crescimento/declínio
    const expenseTrend = this.calculateTrend(
      monthlySummary.map((item) => Number(item.expenses || 0))
    );

    const incomeTrend = this.calculateTrend(
      monthlySummary.map((item) => Number(item.incomes || 0))
    );

    // Obter categorias de maior crescimento
    const categoryTrends = await this.getCategoryTrends(
      userId,
      startDate,
      endDate
    );

    return {
      period: {
        startDate,
        endDate,
        months,
      },
      monthlySummary,
      averages: {
        expenses: avgExpenses,
        incomes: avgIncomes,
        savings: avgIncomes - avgExpenses,
      },
      trends: {
        expenses: {
          trend: expenseTrend,
          direction:
            expenseTrend > 0
              ? "upward"
              : expenseTrend < 0
              ? "downward"
              : "stable",
        },
        incomes: {
          trend: incomeTrend,
          direction:
            incomeTrend > 0
              ? "upward"
              : incomeTrend < 0
              ? "downward"
              : "stable",
        },
      },
      categories: categoryTrends,
    };
  }

  /**
   * Exporta dados para CSV
   */
  private exportToCSV(data: any[], filenameBase: string): ExportResult {
    const parser = new Parser({
      fields: Object.keys(data[0] || {}),
    });

    const csv = data.length > 0 ? parser.parse(data) : "";

    return {
      data: csv,
      contentType: "text/csv",
      filename: `${filenameBase}.csv`,
    };
  }

  /**
   * Exporta dados para Excel
   */
  private async exportToExcel(
    data: any[],
    filenameBase: string
  ): Promise<ExportResult> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transações");

    // Adicionar cabeçalhos
    if (data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key,
        width: 20,
      }));
    }

    // Adicionar dados
    worksheet.addRows(data);

    // Criar buffer para download
    const buffer = (await workbook.xlsx.writeBuffer()) as Uint8Array;

    return {
      data: buffer,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      filename: `${filenameBase}.xlsx`,
    };
  }

  /**
   * Exporta dados para JSON
   */
  private exportToJSON(data: any[], filenameBase: string): ExportResult {
    return {
      data: JSON.stringify(data, null, 2),
      contentType: "application/json",
      filename: `${filenameBase}.json`,
    };
  }

  /**
   * Agrupa transações conforme o período especificado
   */
  private groupTransactions(
    transactions: Transaction[],
    groupBy: ReportGroupBy
  ): Record<string, Transaction[]> {
    const groupedData: Record<string, Transaction[]> = {};

    transactions.forEach((transaction) => {
      let key: string;

      switch (groupBy) {
        case ReportGroupBy.DAY:
          key = format(transaction.date, "yyyy-MM-dd");
          break;
        case ReportGroupBy.WEEK:
          // Semana do ano (1-52)
          key = `${format(transaction.date, "yyyy")}-W${format(
            transaction.date,
            "ww"
          )}`;
          break;
        case ReportGroupBy.MONTH:
          key = format(transaction.date, "yyyy-MM");
          break;
        case ReportGroupBy.QUARTER:
          const month = transaction.date.getMonth();
          const quarter = Math.floor(month / 3) + 1;
          key = `${format(transaction.date, "yyyy")}-Q${quarter}`;
          break;
        case ReportGroupBy.YEAR:
          key = format(transaction.date, "yyyy");
          break;
        case ReportGroupBy.CATEGORY:
          key = transaction.category
            ? transaction.category.name
            : "Sem categoria";
          break;
        default:
          key = format(transaction.date, "yyyy-MM");
      }

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      groupedData[key].push(transaction);
    });

    return groupedData;
  }

  /**
   * Calcula a tendência de crescimento ou declínio com base em uma série de valores
   * Retorna um valor entre -1 e 1, indicando tendência negativa ou positiva
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    // Implementação simplificada de tendência linear
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < values.length; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const n = values.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    // Normalizar a inclinação para um valor entre -1 e 1
    const maxAbsValue = Math.max(...values.map((v) => Math.abs(v)));
    const normalizedSlope = maxAbsValue > 0 ? slope / maxAbsValue : 0;

    // Limitar entre -1 e 1
    return Math.max(-1, Math.min(1, normalizedSlope));
  }

  /**
   * Obtém tendências por categoria (categorias com maior crescimento/declínio)
   */
  private async getCategoryTrends(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    // Este é um método complexo que exigiria análise temporal por categoria
    // Implementação simplificada para ilustração

    // Primeiro mês do período
    const firstMonthStart = startDate;
    const firstMonthEnd = endOfMonth(startDate);

    // Último mês do período
    const lastMonthStart = startOfMonth(endDate);
    const lastMonthEnd = endDate;

    // Obter gastos por categoria no primeiro mês
    const firstMonthExpenses =
      await transactionRepository.getExpenseSummaryByCategory(
        userId,
        firstMonthStart,
        firstMonthEnd
      );

    // Obter gastos por categoria no último mês
    const lastMonthExpenses =
      await transactionRepository.getExpenseSummaryByCategory(
        userId,
        lastMonthStart,
        lastMonthEnd
      );

    // Mapear gastos do primeiro mês por categoria
    const firstMonthMap = new Map();
    firstMonthExpenses.forEach((item) => {
      firstMonthMap.set(item.categoryId, Number(item.total));
    });

    // Calcular variação percentual para cada categoria do último mês
    const categoryTrends = lastMonthExpenses.map((category) => {
      const currentValue = Number(category.total);
      const previousValue = firstMonthMap.get(category.categoryId) || 0;

      // Evitar divisão por zero
      const percentChange =
        previousValue > 0
          ? ((currentValue - previousValue) / previousValue) * 100
          : currentValue > 0
          ? 100
          : 0;

      return {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        currentValue,
        previousValue,
        percentChange,
        direction:
          percentChange > 0 ? "up" : percentChange < 0 ? "down" : "stable",
      };
    });

    // Ordenar por variação percentual (maiores variações primeiro)
    return categoryTrends.sort(
      (a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange)
    );
  }
}

export default new ReportService();
