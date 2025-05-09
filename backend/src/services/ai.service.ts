// src/services/ai.service.ts
import { Anthropic } from "@anthropic-ai/sdk";
import Transaction from "../models/transaction.model";
import Category from "../models/category.model";
import Budget from "../models/budget.model";
import Insight from "../models/insight.model";
import transactionRepository from "../repositories/transaction.repository";
import categoryRepository from "../repositories/category.repository";
import budgetRepository from "../repositories/budget.repository";
import insightRepository from "../repositories/insight.repository";
import { config } from "../config/environment";
import { subDays, format } from "date-fns";
import { NotFoundError, ServiceUnavailableError } from "../utils/errors";

class AIService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  /**
   * Extrai texto da resposta do Claude e limpa formatação Markdown
   */
  private extractTextFromResponse(response: any): string {
    // Verifica se há conteúdo na resposta
    if (!response.content || !response.content.length) {
      throw new Error("Resposta vazia do Claude");
    }

    // Percorre os blocos de conteúdo e extrai o texto
    let fullText = "";
    for (const block of response.content) {
      if (block.type === "text" && block.text) {
        fullText += block.text;
      }
    }

    // Limpa formatação Markdown para JSON
    // Remove delimitadores de código Markdown como ```json e ```
    fullText = fullText.replace(/```json\s*/, "").replace(/```\s*$/, "");

    // Remove outros possíveis delimitadores de código
    fullText = fullText.replace(/```[a-z]*\s*/g, "").replace(/```/g, "");

    // Remove espaços em branco excessivos no início e fim
    fullText = fullText.trim();

    return fullText;
  }

  /**
   * Obtém dados financeiros do usuário para análise pelo Claude
   */
  private async getUserFinancialData(userId: number) {
    // Pegar transações dos últimos 3 meses
    const endDate = new Date();
    const startDate = subDays(endDate, 90);

    // Obter dados
    const transactions = await transactionRepository.findByPeriod(
      userId,
      startDate,
      endDate
    );
    const categories = await categoryRepository.findByUser(userId);
    const budgets = await budgetRepository.findActiveByUser(userId);

    // Mapeamento de categorias para nomes
    const categoryMap = categories.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {} as Record<number, string>);

    // Preparar dados em formato fácil para o Claude analisar
    const financialData = {
      transactions: transactions.map((t) => ({
        id: t.id,
        date: t.date.toISOString(),
        description: t.description,
        amount: t.amount,
        category: categoryMap[t.categoryId] || "Sem categoria",
        isExpense: t.isExpense,
        paymentMethod: t.paymentMethod,
        tags: t.tags,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        isExpense: c.isExpense,
      })),
      budgets: await Promise.all(
        budgets.map(async (b) => {
          const budgetCategories = await b.getCategories();
          return {
            id: b.id,
            name: b.name,
            amount: b.amount,
            categories: budgetCategories.map(
              (cat) => categoryMap[cat.id] || "Sem categoria"
            ),
            startDate: b.startDate.toISOString(),
            endDate: b.endDate.toISOString(),
          };
        })
      ),
    };

    return financialData;
  }

  /**
   * Gera insights financeiros usando Claude 3.7
   */
  async generateInsights(userId: number) {
    try {
      // Obter dados financeiros
      const financialData = await this.getUserFinancialData(userId);

      // Verificar se há dados suficientes para análise
      if (
        !financialData.transactions ||
        financialData.transactions.length === 0
      ) {
        return [
          {
            type: "informativo",
            title: "Dados insuficientes para análise",
            description:
              "Adicione mais transações para receber insights personalizados.",
            relevanceScore: 5.0,
          },
        ];
      }

      // Criar prompt para Claude
      const prompt = `
        Você é um assistente financeiro avançado. Preciso que analise os dados financeiros abaixo
        e gere 3-5 insights relevantes para o usuário. Use "extended thinking" para fazer análises profundas.
        
        Os insights podem incluir:
        1. Padrões de gastos identificados
        2. Oportunidades de economia
        3. Detecção de anomalias em gastos
        4. Recomendações de orçamento
        5. Tendências de longo prazo
        
        Para cada insight, forneça:
        - Um título claro e direto
        - Uma descrição detalhada do insight
        - Categorias relevantes associadas ao insight
        - Valor de impacto financeiro estimado (quando aplicável)
        - Pontuação de relevância (de 1 a 10)
        
        Dados financeiros:
        ${JSON.stringify(financialData, null, 2)}
        
        Responda apenas em formato JSON puro sem qualquer texto adicional, formatação Markdown ou delimitadores de código. Retorne diretamente o array JSON:
        [
          {
            "tipo": "string (padrao_gasto, oportunidade_economia, deteccao_anomalia, recomendacao_orcamento, tendencia)",
            "titulo": "string",
            "descricao": "string",
            "categorias_relevantes": ["string"],
            "valor_impacto": float ou null,
            "pontuacao_relevancia": float
          },
          ...
        ]
      `;

      // Chamada para Claude com extended thinking
      const response = await this.client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 2000,
        temperature: 0.2,
        system:
          "Você é um assistente financeiro especializado. Responda apenas em JSON válido puro, sem formatação Markdown, delimitadores de código ou comentários adicionais.",
        messages: [{ role: "user", content: prompt }],
      });

      // Extrair e analisar JSON da resposta
      const content = this.extractTextFromResponse(response);
      const insightsData = JSON.parse(content);

      // Salvar insights no banco de dados
      const storedInsights = [];

      for (const insight of insightsData) {
        // Mapear nomes de categorias para IDs
        const categoryNames = insight.categorias_relevantes || [];
        const categoryIds = [];

        for (const name of categoryNames) {
          // Encontrar ID da categoria pelo nome
          const category = financialData.categories.find(
            (cat) => cat.name.toLowerCase() === name.toLowerCase()
          );

          if (category) {
            categoryIds.push(category.id);
          }
        }

        // Salvar no banco
        const storedInsight = await insightRepository.create({
          userId,
          type: insight.tipo,
          title: insight.titulo,
          description: insight.descricao,
          impactValue: insight.valor_impacto,
          relevanceScore: insight.pontuacao_relevancia,
          categoryIds: categoryIds,
        });

        storedInsights.push(storedInsight);
      }

      // Remover insights antigos para manter o banco limpo
      await insightRepository.pruneOldInsights(userId, 50);

      return storedInsights;
    } catch (error) {
      console.error("Erro ao processar resposta do Claude:", error);
      throw new ServiceUnavailableError(
        "Não foi possível gerar insights no momento. Tente novamente mais tarde."
      );
    }
  }

  /**
   * Gera uma recomendação específica baseada em uma transação
   */
  async getTransactionRecommendation(userId: number, transactionData: any) {
    try {
      // Obter histórico limitado para contexto
      const endDate = new Date();
      const startDate = subDays(endDate, 30);

      const transactions = await transactionRepository.findByPeriod(
        userId,
        startDate,
        endDate
      );
      const categories = await categoryRepository.findByUser(userId);

      // Mapeamento de categorias
      const categoryMap = categories.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {} as Record<number, string>);

      // Converter transações para formato mais simples
      const simplifiedTransactions = transactions.map((t) => ({
        date: t.date.toISOString(),
        description: t.description,
        amount: t.amount,
        category: categoryMap[t.categoryId] || "Sem categoria",
        isExpense: t.isExpense,
      }));

      // Criar prompt para Claude
      const prompt = `
        Analise esta nova transação e forneça uma recomendação financeira 
        contextualizada com base no histórico recente do usuário:
        
        Nova transação:
        ${JSON.stringify(transactionData, null, 2)}
        
        Histórico recente de transações (últimos 30 dias):
        ${JSON.stringify(simplifiedTransactions, null, 2)}
        
        Forneça uma recomendação relevante em JSON considerando:
        1. Se esta transação está de acordo com o padrão de gastos do usuário
        2. Se há oportunidades de economia relacionadas a esta categoria
        3. Sugestões relevantes para o planejamento financeiro
        
        Responda apenas em formato JSON puro, sem formatação Markdown ou delimitadores de código:
        {
          "titulo": "string",
          "recomendacao": "string",
          "dica_economia": "string ou null",
          "pontuacao_relevancia": float
        }
      `;

      // Chamada para Claude
      const response = await this.client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 0.3,
        system:
          "Você é um assistente financeiro especializado. Responda apenas em JSON válido puro, sem formatação Markdown, delimitadores de código ou comentários adicionais.",
        messages: [{ role: "user", content: prompt }],
      });

      // Processar resposta
      const content = this.extractTextFromResponse(response);
      const recommendation = JSON.parse(content);
      return recommendation;
    } catch (error) {
      console.error("Erro ao processar recomendação:", error);
      return {
        titulo: "Recomendação não disponível",
        recomendacao: "Não foi possível gerar uma recomendação neste momento.",
        dica_economia: null,
        pontuacao_relevancia: 0,
      };
    }
  }

  /**
   * Gera previsões de gastos futuros baseados em dados históricos
   */
  async generateForecast(userId: number, months: number = 3) {
    try {
      // Obter dados dos últimos 6 meses
      const endDate = new Date();
      const startDate = subDays(endDate, 180); // 6 meses de histórico

      const transactions = await transactionRepository.findByPeriod(
        userId,
        startDate,
        endDate
      );

      // Agrupar dados por mês e categoria
      const monthlyData: Record<string, Record<string, number>> = {};

      transactions.forEach((transaction) => {
        if (!transaction.isExpense) return; // Ignorar receitas para previsão de gastos

        const monthKey = format(transaction.date, "yyyy-MM");
        const category = transaction.category
          ? transaction.category.name
          : "Outros";

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {};
        }

        if (!monthlyData[monthKey][category]) {
          monthlyData[monthKey][category] = 0;
        }

        monthlyData[monthKey][category] += Number(transaction.amount);
      });

      // Criar prompt para Claude
      const prompt = `
        Você é um analista financeiro especializado em previsões. Com base nos dados
        históricos de gastos do usuário, faça uma previsão para os próximos ${months} meses.
        
        Dados mensais por categoria:
        ${JSON.stringify(monthlyData, null, 2)}
        
        Analise os padrões de gastos e tendências para prever os valores futuros.
        Considere sazonalidade, tendências de longo prazo e gasto médio.
        
        Responda apenas em formato JSON puro, sem formatação Markdown ou delimitadores de código:
        {
          "previsao": [
            {
              "mes": "yyyy-MM",
              "categorias": {
                "categoria1": valor_previsto,
                "categoria2": valor_previsto,
                ...
              },
              "total": valor_total_previsto
            },
            ...
          ],
          "explicacao": "string com explicação concisa da análise"
        }
      `;

      // Chamada para Claude com extended thinking
      const response = await this.client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 2000,
        temperature: 0.3,
        system:
          "Você é um analista financeiro especializado. Responda apenas em JSON válido puro, sem formatação Markdown, delimitadores de código ou comentários adicionais.",
        messages: [{ role: "user", content: prompt }],
      });

      // Processar resposta
      const content = this.extractTextFromResponse(response);
      const forecast = JSON.parse(content);
      return forecast;
    } catch (error) {
      console.error("Erro ao gerar previsão:", error);
      throw new ServiceUnavailableError(
        "Não foi possível gerar a previsão no momento."
      );
    }
  }

  /**
   * Analisa padrões de comportamento financeiro e sugere melhorias
   */
  async generateFinancialHealthCheck(userId: number) {
    try {
      // Obter dados completos para uma análise abrangente
      const financialData = await this.getUserFinancialData(userId);

      // Criar prompt para Claude
      const prompt = `
        Realize uma análise completa da saúde financeira com base nos dados fornecidos.
        Avalie as seguintes áreas:
        
        1. Equilíbrio entre receitas e despesas
        2. Distribuição de gastos por categoria
        3. Sustentabilidade dos padrões de gastos
        4. Adequação dos orçamentos existentes
        5. Oportunidades de economia
        
        Dados financeiros:
        ${JSON.stringify(financialData, null, 2)}
        
        Forneça uma avaliação em formato JSON puro, sem formatação Markdown ou delimitadores de código:
        {
          "pontuacao_saude": float (0-10),
          "avaliacoes": [
            {
              "area": "string",
              "pontuacao": float (0-10),
              "analise": "string",
              "recomendacoes": ["string"]
            },
            ...
          ],
          "resumo": "string",
          "acoes_recomendadas": ["string"]
        }
      `;

      // Chamada para Claude
      const response = await this.client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 2500,
        temperature: 0.2,
        system:
          "Você é um consultor financeiro experiente. Responda apenas em JSON válido puro, sem formatação Markdown, delimitadores de código ou comentários adicionais.",
        messages: [{ role: "user", content: prompt }],
      });

      // Processar resposta
      const content = this.extractTextFromResponse(response);
      const healthCheck = JSON.parse(content);
      return healthCheck;
    } catch (error) {
      console.error("Erro ao gerar análise de saúde financeira:", error);
      throw new ServiceUnavailableError(
        "Não foi possível realizar a análise no momento."
      );
    }
  }
}

export default new AIService();
