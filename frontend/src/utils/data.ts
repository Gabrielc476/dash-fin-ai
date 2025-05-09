// src/utils/data.ts
import {
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
  differenceInDays,
  differenceInMonths,
  isAfter,
  isBefore,
  isSameDay,
  format,
  parse,
  isValid,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Obtém a data de início e fim para um período predefinido
 * @param periodo Período desejado: 'hoje', 'ontem', 'semana', 'mes', 'ano', 'ultimos30', 'ultimos90'
 * @returns Objeto com data de início e fim
 */
export const obterPeriodo = (periodo: string): { inicio: Date; fim: Date } => {
  const hoje = new Date();

  switch (periodo) {
    case "hoje":
      return {
        inicio: startOfDay(hoje),
        fim: endOfDay(hoje),
      };
    case "ontem":
      const ontem = subDays(hoje, 1);
      return {
        inicio: startOfDay(ontem),
        fim: endOfDay(ontem),
      };
    case "semana":
      return {
        inicio: startOfWeek(hoje, { locale: ptBR }),
        fim: endOfWeek(hoje, { locale: ptBR }),
      };
    case "mes":
      return {
        inicio: startOfMonth(hoje),
        fim: endOfMonth(hoje),
      };
    case "trimestre":
      return {
        inicio: startOfQuarter(hoje),
        fim: endOfQuarter(hoje),
      };
    case "ano":
      return {
        inicio: startOfYear(hoje),
        fim: endOfYear(hoje),
      };
    case "ultimos7":
      return {
        inicio: startOfDay(subDays(hoje, 6)),
        fim: endOfDay(hoje),
      };
    case "ultimos30":
      return {
        inicio: startOfDay(subDays(hoje, 29)),
        fim: endOfDay(hoje),
      };
    case "ultimos90":
      return {
        inicio: startOfDay(subDays(hoje, 89)),
        fim: endOfDay(hoje),
      };
    case "ultimos365":
      return {
        inicio: startOfDay(subDays(hoje, 364)),
        fim: endOfDay(hoje),
      };
    default:
      return {
        inicio: startOfMonth(hoje),
        fim: endOfMonth(hoje),
      };
  }
};

/**
 * Formata uma data para ser usada em uma requisição à API
 * @param data Data a ser formatada
 * @returns String formatada como ISO (YYYY-MM-DD)
 */
export const formatarDataParaAPI = (data: Date): string => {
  return format(data, "yyyy-MM-dd");
};

/**
 * Converte uma string de data para um objeto Date
 * @param dataString String de data (formato padrão: DD/MM/YYYY)
 * @param formato Formato da string de data
 * @returns Objeto Date
 */
export const converterStringParaData = (
  dataString: string,
  formato = "dd/MM/yyyy"
): Date | null => {
  if (!dataString) return null;

  // Tenta converter usando o parse
  const dataConvertida = parse(dataString, formato, new Date());

  // Verifica se a data é válida
  if (!isValid(dataConvertida)) return null;

  return dataConvertida;
};

/**
 * Converte uma string ISO para um objeto Date
 * @param dataIso String de data no formato ISO
 * @returns Objeto Date
 */
export const converterISOParaData = (dataIso: string): Date | null => {
  if (!dataIso) return null;

  try {
    const data = parseISO(dataIso);

    // Verifica se a data é válida
    if (!isValid(data)) return null;

    return data;
  } catch (error) {
    return null;
  }
};

/**
 * Gera um array com os últimos N meses
 * @param quantidade Quantidade de meses a serem gerados
 * @param incluirAtual Se deve incluir o mês atual
 * @returns Array de objetos com valor e label de cada mês
 */
export const gerarUltimosMeses = (
  quantidade: number,
  incluirAtual = true
): { valor: string; label: string }[] => {
  const hoje = new Date();
  const meses = [];

  for (let i = 0; i < quantidade; i++) {
    const data = subMonths(hoje, incluirAtual ? i : i + 1);
    const valor = format(data, "yyyy-MM");
    const label = format(data, "MMMM/yyyy", { locale: ptBR });

    meses.push({ valor, label });
  }

  return meses;
};

/**
 * Gera um array com os últimos N anos
 * @param quantidade Quantidade de anos a serem gerados
 * @param incluirAtual Se deve incluir o ano atual
 * @returns Array de objetos com valor e label de cada ano
 */
export const gerarUltimosAnos = (
  quantidade: number,
  incluirAtual = true
): { valor: string; label: string }[] => {
  const hoje = new Date();
  const anos = [];

  for (let i = 0; i < quantidade; i++) {
    const data = subYears(hoje, incluirAtual ? i : i + 1);
    const valor = format(data, "yyyy");
    const label = valor;

    anos.push({ valor, label });
  }

  return anos;
};

/**
 * Calcula a diferença em dias entre duas datas
 * @param dataInicio Data de início
 * @param dataFim Data de fim
 * @returns Número de dias entre as datas
 */
export const calcularDiferencaDias = (
  dataInicio: Date,
  dataFim: Date
): number => {
  return differenceInDays(dataFim, dataInicio);
};

/**
 * Calcula a diferença em meses entre duas datas
 * @param dataInicio Data de início
 * @param dataFim Data de fim
 * @returns Número de meses entre as datas
 */
export const calcularDiferencaMeses = (
  dataInicio: Date,
  dataFim: Date
): number => {
  return differenceInMonths(dataFim, dataInicio);
};

/**
 * Verifica se uma data está entre duas datas (inclusiva)
 * @param data Data a ser verificada
 * @param dataInicio Data de início do período
 * @param dataFim Data de fim do período
 * @returns Boolean indicando se a data está no período
 */
export const dataEntrePeriodo = (
  data: Date,
  dataInicio: Date,
  dataFim: Date
): boolean => {
  return (
    (isAfter(data, dataInicio) || isSameDay(data, dataInicio)) &&
    (isBefore(data, dataFim) || isSameDay(data, dataFim))
  );
};

/**
 * Gera um array de datas para um período (de início a fim)
 * @param dataInicio Data de início
 * @param dataFim Data de fim
 * @returns Array de datas
 */
export const gerarArrayDatas = (dataInicio: Date, dataFim: Date): Date[] => {
  const datas = [];
  let dataAtual = new Date(dataInicio);

  while (isBefore(dataAtual, dataFim) || isSameDay(dataAtual, dataFim)) {
    datas.push(new Date(dataAtual));
    dataAtual = addDays(dataAtual, 1);
  }

  return datas;
};

/**
 * Obtém o nome do mês por extenso
 * @param mes Número do mês (1-12)
 * @returns Nome do mês por extenso
 */
export const obterNomeMes = (mes: number): string => {
  const data = new Date(2020, mes - 1, 1);
  return format(data, "MMMM", { locale: ptBR });
};

/**
 * Obtém o nome do dia da semana por extenso
 * @param data Data para obter o dia da semana
 * @returns Nome do dia da semana por extenso
 */
export const obterNomeDiaSemana = (data: Date): string => {
  return format(data, "EEEE", { locale: ptBR });
};

/**
 * Verifica se uma data é fim de semana
 * @param data Data a ser verificada
 * @returns Boolean indicando se é fim de semana
 */
export const ehFimDeSemana = (data: Date): boolean => {
  const diaSemana = data.getDay();
  return diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado
};
