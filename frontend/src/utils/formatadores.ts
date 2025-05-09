// src/utils/formatadores.ts
import { format as formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata um valor numérico para moeda (Real brasileiro)
 * @param valor Valor a ser formatado
 * @param simbolo Se deve incluir o símbolo da moeda
 * @returns String formatada em moeda
 */
export const formatarMoeda = (valor: number, simbolo = true): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: simbolo ? "currency" : "decimal",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

/**
 * Formata um valor numérico para exibição em percentual
 * @param valor Valor a ser formatado (ex: 0.75 para 75%)
 * @param casasDecimais Número de casas decimais a serem exibidas
 * @returns String formatada em percentual
 */
export const formatarPercentual = (
  valor: number,
  casasDecimais = 1
): string => {
  return `${(valor * 100).toFixed(casasDecimais)}%`;
};

/**
 * Formata uma data para exibição conforme o formato especificado
 * @param data Data a ser formatada
 * @param formato Formato de exibição (padrão: dd/MM/yyyy)
 * @returns String formatada em data
 */
export const formatarData = (
  data: Date | string,
  formato = "dd/MM/yyyy"
): string => {
  if (!data) return "";

  const dataObj = typeof data === "string" ? new Date(data) : data;
  return formatDate(dataObj, formato, { locale: ptBR });
};

/**
 * Formata um valor numérico para o tamanho especificado por extenso
 * @param valor Valor a ser formatado
 * @returns String formatada com o número por extenso
 */
export const formatarNumeroPorExtenso = (valor: number): string => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Remove o símbolo da moeda e mantém apenas o número formatado
  return formatter.format(valor).replace(/[^\d,.]/g, "");
};

/**
 * Formata o nome de usuário para exibição (iniciais ou nome com sobrenome abreviado)
 * @param nome Nome completo do usuário
 * @param tipo Tipo de formatação: 'initials' para iniciais, 'short' para nome abreviado
 * @returns String formatada com o nome do usuário
 */
export const formatarNomeUsuario = (
  nome: string,
  tipo: "initials" | "short" = "short"
): string => {
  if (!nome) return "";

  const partes = nome.trim().split(" ");

  if (tipo === "initials") {
    // Retorna as iniciais (máx 2)
    return partes
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join("");
  } else {
    // Retorna primeiro nome + iniciais dos sobrenomes
    if (partes.length === 1) return partes[0];

    return `${partes[0]} ${partes[partes.length - 1]}`;
  }
};

/**
 * Formata um texto com limite de caracteres
 * @param texto Texto a ser formatado
 * @param maxCaracteres Número máximo de caracteres
 * @param comReticencias Se deve adicionar reticências ao truncar
 * @returns String formatada com limite de caracteres
 */
export const truncarTexto = (
  texto: string,
  maxCaracteres: number,
  comReticencias = true
): string => {
  if (!texto) return "";

  if (texto.length <= maxCaracteres) return texto;

  return `${texto.slice(0, maxCaracteres)}${comReticencias ? "..." : ""}`;
};

/**
 * Formata um valor para exibição em cartão de crédito
 * @param numero Número do cartão a ser formatado
 * @returns String formatada como número de cartão
 */
export const formatarNumeroCartao = (numero: string): string => {
  if (!numero) return "";

  const numeroLimpo = numero.replace(/\D/g, "");
  const grupos = numeroLimpo.match(/.{1,4}/g);

  return grupos ? grupos.join(" ") : numeroLimpo;
};

/**
 * Formata um número de telefone para exibição
 * @param telefone Número de telefone a ser formatado
 * @returns String formatada como telefone
 */
export const formatarTelefone = (telefone: string): string => {
  if (!telefone) return "";

  const numeroLimpo = telefone.replace(/\D/g, "");

  if (numeroLimpo.length === 11) {
    // Celular (99) 99999-9999
    return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (numeroLimpo.length === 10) {
    // Fixo (99) 9999-9999
    return numeroLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
};

/**
 * Formata um tamanho em bytes para exibição mais amigável
 * @param bytes Tamanho em bytes
 * @param decimais Número de casas decimais a serem exibidas
 * @returns String formatada com o tamanho
 */
export const formatarTamanhoArquivo = (bytes: number, decimais = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimais))} ${
    sizes[i]
  }`;
};

/**
 * Converte uma string para um formato a ser usado como ID ou slug
 * @param texto Texto a ser convertido
 * @returns String formatada para uso como slug
 */
export const formatarParaSlug = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};
