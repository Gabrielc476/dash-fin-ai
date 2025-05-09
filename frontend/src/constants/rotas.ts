// src/constants/rotas.ts

// Rotas da aplicação
export const ROTAS = {
  // Rotas públicas
  PUBLIC: {
    LOGIN: "/login",
    REGISTRO: "/register",
    ESQUECI_SENHA: "/forgot-password",
  },

  // Rotas privadas (exigem autenticação)
  PRIVATE: {
    DASHBOARD: "/dashboard",

    // Transações
    TRANSACOES: {
      LISTAR: "/transactions",
      ADICIONAR: "/transactions/add",
      EDITAR: (id: string | number) => `/transactions/${id}/edit`,
      DETALHE: (id: string | number) => `/transactions/${id}`,
    },

    // Categorias
    CATEGORIAS: {
      LISTAR: "/categories",
      ADICIONAR: "/categories/add",
      EDITAR: (id: string | number) => `/categories/${id}/edit`,
    },

    // Orçamentos
    ORCAMENTOS: {
      LISTAR: "/budgets",
      ADICIONAR: "/budgets/add",
      EDITAR: (id: string | number) => `/budgets/${id}/edit`,
      DETALHE: (id: string | number) => `/budgets/${id}`,
    },

    // Relatórios
    RELATORIOS: {
      INICIO: "/reports",
      RECEITA_DESPESA: "/reports/income-expense",
      CATEGORIA: "/reports/category",
      TENDENCIAS: "/reports/trends",
      EXPORTAR: "/reports/export",
    },

    // Insights de IA
    INSIGHTS: {
      LISTAR: "/insights",
      DETALHE: (id: string | number) => `/insights/${id}`,
    },

    // Configurações
    CONFIGURACOES: "/settings",

    // Perfil
    PERFIL: "/profile",
  },

  // Rotas de API
  API: {
    BASE: "/api/v1",

    // Autenticação
    AUTH: {
      LOGIN: "/auth/login",
      REGISTRO: "/auth/register",
      REFRESH_TOKEN: "/auth/refresh-token",
      PERFIL: "/auth/me",
    },

    // Transações
    TRANSACOES: {
      BASE: "/transactions",
      POR_ID: (id: string | number) => `/transactions/${id}`,
      RESUMO_CATEGORIAS: "/transactions/resumo/categorias",
      RESUMO_MENSAL: "/transactions/resumo/mensal",
    },

    // Categorias
    CATEGORIAS: {
      BASE: "/categories",
      POR_ID: (id: string | number) => `/categories/${id}`,
    },

    // Orçamentos
    ORCAMENTOS: {
      BASE: "/budgets",
      POR_ID: (id: string | number) => `/budgets/${id}`,
      PROGRESSO: (id: string | number) => `/budgets/${id}/progress`,
    },

    // Relatórios
    RELATORIOS: {
      RECEITA_DESPESA: "/reports/income-expense",
      CATEGORIA: "/reports/category",
      EXPORTAR: "/reports/export",
      TENDENCIAS: "/reports/trends",
    },

    // IA Insights
    IA: {
      INSIGHTS: "/ai/insights",
      GERAR_INSIGHTS: "/ai/insights/generate",
      INSIGHTS_POR_ID: (id: string | number) => `/ai/insights/${id}`,
      INSIGHTS_POR_CATEGORIA: (categoryId: string | number) =>
        `/ai/insights/category/${categoryId}`,
      RECOMENDACAO_TRANSACAO: "/ai/recommendation/transaction",
      PREVISAO: "/ai/forecast",
      SAUDE_FINANCEIRA: "/ai/health-check",
    },
  },
};

// Mapeamento de rotas para títulos
export const TITULOS_PAGINAS = {
  [ROTAS.PUBLIC.LOGIN]: "Login",
  [ROTAS.PUBLIC.REGISTRO]: "Criar Conta",
  [ROTAS.PUBLIC.ESQUECI_SENHA]: "Recuperar Senha",

  [ROTAS.PRIVATE.DASHBOARD]: "Dashboard",
  [ROTAS.PRIVATE.TRANSACOES.LISTAR]: "Transações",
  [ROTAS.PRIVATE.TRANSACOES.ADICIONAR]: "Nova Transação",
  // Títulos dinâmicos são definidos na página

  [ROTAS.PRIVATE.CATEGORIAS.LISTAR]: "Categorias",
  [ROTAS.PRIVATE.CATEGORIAS.ADICIONAR]: "Nova Categoria",

  [ROTAS.PRIVATE.ORCAMENTOS.LISTAR]: "Orçamentos",
  [ROTAS.PRIVATE.ORCAMENTOS.ADICIONAR]: "Novo Orçamento",

  [ROTAS.PRIVATE.RELATORIOS.INICIO]: "Relatórios",
  [ROTAS.PRIVATE.RELATORIOS.RECEITA_DESPESA]:
    "Relatório de Receitas e Despesas",
  [ROTAS.PRIVATE.RELATORIOS.CATEGORIA]: "Relatório por Categoria",
  [ROTAS.PRIVATE.RELATORIOS.TENDENCIAS]: "Tendências Financeiras",
  [ROTAS.PRIVATE.RELATORIOS.EXPORTAR]: "Exportar Dados",

  [ROTAS.PRIVATE.INSIGHTS.LISTAR]: "Insights Financeiros",

  [ROTAS.PRIVATE.CONFIGURACOES]: "Configurações",
  [ROTAS.PRIVATE.PERFIL]: "Meu Perfil",
};
