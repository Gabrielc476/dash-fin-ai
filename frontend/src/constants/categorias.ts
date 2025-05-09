// src/constants/categorias.ts

// Cores padrão para categorias
export const CORES_CATEGORIAS = {
  DESPESA: {
    ALIMENTACAO: "#FF5733",
    MORADIA: "#33FF57",
    TRANSPORTE: "#3357FF",
    SAUDE: "#FF33A8",
    EDUCACAO: "#33FFC4",
    LAZER: "#FFD433",
    OUTROS: "#AAAAAA",
  },
  RECEITA: {
    SALARIO: "#4CAF50",
    INVESTIMENTOS: "#2196F3",
    PRESENTE: "#9C27B0",
    OUTROS: "#607D8B",
  },
};

// Ícones padrão para categorias (usando nomes de ícones compatíveis com a biblioteca de ícones)
export const ICONES_CATEGORIAS = {
  DESPESA: {
    ALIMENTACAO: "utensils",
    MORADIA: "home",
    TRANSPORTE: "car",
    SAUDE: "heartbeat",
    EDUCACAO: "book",
    LAZER: "film",
    OUTROS: "tag",
  },
  RECEITA: {
    SALARIO: "briefcase",
    INVESTIMENTOS: "chart-line",
    PRESENTE: "gift",
    OUTROS: "tag",
  },
};

// Nomes padrão para categorias
export const NOMES_CATEGORIAS = {
  DESPESA: {
    ALIMENTACAO: "Alimentação",
    MORADIA: "Moradia",
    TRANSPORTE: "Transporte",
    SAUDE: "Saúde",
    EDUCACAO: "Educação",
    LAZER: "Lazer",
    OUTROS: "Outros",
  },
  RECEITA: {
    SALARIO: "Salário",
    INVESTIMENTOS: "Investimentos",
    PRESENTE: "Presente",
    OUTROS: "Outros",
  },
};

// Categorias padrão para novos usuários
export const CATEGORIAS_PADRAO = [
  // Categorias de despesa
  {
    name: NOMES_CATEGORIAS.DESPESA.ALIMENTACAO,
    color: CORES_CATEGORIAS.DESPESA.ALIMENTACAO,
    icon: ICONES_CATEGORIAS.DESPESA.ALIMENTACAO,
    isExpense: true,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.DESPESA.MORADIA,
    color: CORES_CATEGORIAS.DESPESA.MORADIA,
    icon: ICONES_CATEGORIAS.DESPESA.MORADIA,
    isExpense: true,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.DESPESA.TRANSPORTE,
    color: CORES_CATEGORIAS.DESPESA.TRANSPORTE,
    icon: ICONES_CATEGORIAS.DESPESA.TRANSPORTE,
    isExpense: true,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.DESPESA.SAUDE,
    color: CORES_CATEGORIAS.DESPESA.SAUDE,
    icon: ICONES_CATEGORIAS.DESPESA.SAUDE,
    isExpense: true,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.DESPESA.EDUCACAO,
    color: CORES_CATEGORIAS.DESPESA.EDUCACAO,
    icon: ICONES_CATEGORIAS.DESPESA.EDUCACAO,
    isExpense: true,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.DESPESA.LAZER,
    color: CORES_CATEGORIAS.DESPESA.LAZER,
    icon: ICONES_CATEGORIAS.DESPESA.LAZER,
    isExpense: true,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.DESPESA.OUTROS,
    color: CORES_CATEGORIAS.DESPESA.OUTROS,
    icon: ICONES_CATEGORIAS.DESPESA.OUTROS,
    isExpense: true,
    isDefault: true,
  },
  // Categorias de receita
  {
    name: NOMES_CATEGORIAS.RECEITA.SALARIO,
    color: CORES_CATEGORIAS.RECEITA.SALARIO,
    icon: ICONES_CATEGORIAS.RECEITA.SALARIO,
    isExpense: false,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.RECEITA.INVESTIMENTOS,
    color: CORES_CATEGORIAS.RECEITA.INVESTIMENTOS,
    icon: ICONES_CATEGORIAS.RECEITA.INVESTIMENTOS,
    isExpense: false,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.RECEITA.PRESENTE,
    color: CORES_CATEGORIAS.RECEITA.PRESENTE,
    icon: ICONES_CATEGORIAS.RECEITA.PRESENTE,
    isExpense: false,
    isDefault: true,
  },
  {
    name: NOMES_CATEGORIAS.RECEITA.OUTROS,
    color: CORES_CATEGORIAS.RECEITA.OUTROS,
    icon: ICONES_CATEGORIAS.RECEITA.OUTROS,
    isExpense: false,
    isDefault: true,
  },
];

// Métodos de pagamento
export const METODOS_PAGAMENTO = {
  CARTAO_CREDITO: "CREDIT_CARD",
  CARTAO_DEBITO: "DEBIT_CARD",
  TRANSFERENCIA: "BANK_TRANSFER",
  DINHEIRO: "CASH",
  PIX: "PIX",
  CARTEIRA_DIGITAL: "DIGITAL_WALLET",
  OUTRO: "OTHER",
};

// Labels para exibição dos métodos de pagamento
export const LABELS_METODOS_PAGAMENTO = {
  [METODOS_PAGAMENTO.CARTAO_CREDITO]: "Cartão de Crédito",
  [METODOS_PAGAMENTO.CARTAO_DEBITO]: "Cartão de Débito",
  [METODOS_PAGAMENTO.TRANSFERENCIA]: "Transferência Bancária",
  [METODOS_PAGAMENTO.DINHEIRO]: "Dinheiro",
  [METODOS_PAGAMENTO.PIX]: "PIX",
  [METODOS_PAGAMENTO.CARTEIRA_DIGITAL]: "Carteira Digital",
  [METODOS_PAGAMENTO.OUTRO]: "Outro",
};
