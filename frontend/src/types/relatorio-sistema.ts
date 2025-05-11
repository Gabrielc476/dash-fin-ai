// frontend/src/types/relatorio-sistema.ts
import {
  FormatoExportacao,
  TipoAgrupamento,
  RelatorioReceitaDespesa,
  RelatorioCategoria,
  Tendencia,
} from "./relatorio";

/**
 * Tipos de relatórios disponíveis no sistema
 */
export enum TipoRelatorio {
  RECEITA_DESPESA = "receita-despesa",
  CATEGORIA = "categoria",
  TENDENCIAS = "tendencias",
  EXPORTACAO = "exportacao",
  PERSONALIZADO = "personalizado",
}

/**
 * Relatório salvo ou recente
 */
export interface RelatorioSalvo {
  id: string;
  userId: number;
  titulo: string;
  descricao?: string;
  tipo: TipoRelatorio;
  parametros: RelatorioParametros;
  dataCriacao: Date;
  dataAtualizacao: Date;
  favorito: boolean;
  compartilhado: boolean;
  rota: string;
}

/**
 * Parâmetros para configuração de relatórios
 */
export interface RelatorioParametros {
  dataInicial: string; // ISO string
  dataFinal: string; // ISO string
  periodo?: string;
  agrupamento?: TipoAgrupamento;
  incluirReceitas?: boolean;
  incluirDespesas?: boolean;
  categoriasIds?: number[];
  formatoExportacao?: FormatoExportacao;
  filtrosAdicionais?: Record<string, any>;
}

/**
 * Resultado do relatório
 */
export interface RelatorioResultado {
  id: string;
  tipo: TipoRelatorio;
  parametros: RelatorioParametros;
  dados: RelatorioReceitaDespesa | RelatorioCategoria | Tendencia | null;
  dataCriacao: Date;
  tempoExecucao: number; // em ms
}

/**
 * Configuração visual de um relatório
 */
export interface RelatorioVisualizacao {
  tipoGrafico: TipoGraficoRelatorio;
  cores?: string[];
  altura?: number;
  largura?: number;
  mostrarLegenda?: boolean;
  mostrarEixos?: boolean;
  mostrarValores?: boolean;
  formatacaoValor?: "moeda" | "percentual" | "numero" | "data";
  tituloPersonalizado?: string;
  descricaoPersonalizada?: string;
}

/**
 * Tipos de gráficos disponíveis
 */
export type TipoGraficoRelatorio =
  | "linha"
  | "barra"
  | "barraHorizontal"
  | "pizza"
  | "rosca"
  | "area"
  | "radar"
  | "dispersao"
  | "tabela";

/**
 * Permissões para relatórios
 */
export interface RelatorioPermissoes {
  visualizar: boolean;
  editar: boolean;
  excluir: boolean;
  compartilhar: boolean;
  exportar: boolean;
  programar: boolean;
}

/**
 * Configuração de notificação para relatórios agendados
 */
export interface RelatorioNotificacao {
  id: string;
  relatorioId: string;
  tipo: "email" | "app" | "webhook";
  destino: string; // email, userId ou URL
  frequencia: "diaria" | "semanal" | "mensal" | "trimestral";
  horario?: string; // formato HH:MM
  diaSemana?: number; // 0-6 (domingo-sábado)
  diaMes?: number; // 1-31
  ativa: boolean;
  ultimoEnvio?: Date;
  proximoEnvio?: Date;
}

/**
 * Histórico de geração de relatórios
 */
export interface RelatorioHistorico {
  id: string;
  relatorioId: string;
  userId: number;
  dataGeracao: Date;
  parametros: RelatorioParametros;
  tempoExecucao: number; // em ms
  formatoExportacao?: FormatoExportacao;
  tamanhoArquivo?: number; // em bytes
  status: "sucesso" | "erro" | "cancelado";
  mensagemErro?: string;
}

/**
 * Interface para o sistema de relatórios
 */
export interface SistemaRelatorios {
  // Métodos para gerenciar relatórios
  criarRelatorio: (
    tipo: TipoRelatorio,
    parametros: RelatorioParametros,
    titulo: string
  ) => Promise<RelatorioSalvo>;
  obterRelatorio: (id: string) => Promise<RelatorioSalvo | null>;
  atualizarRelatorio: (
    id: string,
    dados: Partial<RelatorioSalvo>
  ) => Promise<RelatorioSalvo>;
  excluirRelatorio: (id: string) => Promise<boolean>;
  listarRelatoriosRecentes: (limite?: number) => Promise<RelatorioSalvo[]>;
  listarRelatoriosFavoritos: () => Promise<RelatorioSalvo[]>;

  // Métodos para executar relatórios
  executarRelatorio: (
    id: string | RelatorioParametros
  ) => Promise<RelatorioResultado>;
  exportarRelatorio: (id: string, formato: FormatoExportacao) => Promise<Blob>;

  // Métodos para favoritos
  marcarComoFavorito: (id: string, favorito: boolean) => Promise<boolean>;

  // Métodos para compartilhamento
  compartilharRelatorio: (id: string, usuarios: number[]) => Promise<boolean>;
  obterLinkCompartilhamento: (id: string) => Promise<string>;
}
