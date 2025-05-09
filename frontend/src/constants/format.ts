// src/constants/format.ts

// Opções de formatação de moeda
export const FORMATO_MOEDA = {
  ESTILO: "currency",
  MOEDA: "BRL",
  CASAS_DECIMAIS: 2,
};

// Função para formatar moeda
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: FORMATO_MOEDA.ESTILO,
    currency: FORMATO_MOEDA.MOEDA,
    minimumFractionDigits: FORMATO_MOEDA.CASAS_DECIMAIS,
  }).format(valor);
};

// Opções de formatação de data
export const FORMATO_DATA = {
  COMPLETO: "dd/MM/yyyy HH:mm",
  DATA: "dd/MM/yyyy",
  MES_ANO: "MM/yyyy",
  MES_ANO_TEXTUAL: "MMMM/yyyy",
  DIA_MES: "dd/MM",
};

// Opções de formatação de percentual
export const FORMATO_PERCENTUAL = {
  CASAS_DECIMAIS: 1,
  SIMBOLO: "%",
};

// Função para formatar percentual
export const formatarPercentual = (valor: number): string => {
  return `${valor.toFixed(FORMATO_PERCENTUAL.CASAS_DECIMAIS)}${
    FORMATO_PERCENTUAL.SIMBOLO
  }`;
};

// Limites para alertas de orçamento
export const LIMITES_ALERTA = {
  ATENCAO: 80, // Percentual a partir do qual mostra alerta de atenção
  PERIGO: 100, // Percentual a partir do qual mostra alerta de perigo
};

// Cores para visualizações
export const CORES_GRAFICOS = {
  RECEITA: "#4CAF50",
  DESPESA: "#F44336",
  SALDO: "#2196F3",
  NEUTRO: "#9E9E9E",

  // Paleta para gráficos com múltiplas séries
  PALETA: [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#3B3EAC",
  ],
};
