// src/utils/mascaras.ts

/**
 * Aplica máscara de CPF
 * @param valor Valor a receber a máscara
 * @returns String formatada (ex: 123.456.789-00)
 */
export const mascaraCPF = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não numéricos
  const apenasNumeros = valor.replace(/\D/g, "");

  // Limita a 11 caracteres
  const cpfLimitado = apenasNumeros.slice(0, 11);

  // Aplica a máscara
  return cpfLimitado
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

/**
 * Aplica máscara de CNPJ
 * @param valor Valor a receber a máscara
 * @returns String formatada (ex: 12.345.678/0001-90)
 */
export const mascaraCNPJ = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não numéricos
  const apenasNumeros = valor.replace(/\D/g, "");

  // Limita a 14 caracteres
  const cnpjLimitado = apenasNumeros.slice(0, 14);

  // Aplica a máscara
  return cnpjLimitado
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

/**
 * Aplica máscara de telefone (fixo ou celular)
 * @param valor Valor a receber a máscara
 * @returns String formatada (ex: (99) 9999-9999 ou (99) 99999-9999)
 */
export const mascaraTelefone = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não numéricos
  const apenasNumeros = valor.replace(/\D/g, "");

  // Limita a 11 caracteres
  const telefoneLimitado = apenasNumeros.slice(0, 11);

  // Aplica máscara conforme quantidade de dígitos
  if (telefoneLimitado.length <= 10) {
    return telefoneLimitado
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    return telefoneLimitado
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
};

/**
 * Aplica máscara de CEP
 * @param valor Valor a receber a máscara
 * @returns String formatada (ex: 12345-678)
 */
export const mascaraCEP = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não numéricos
  const apenasNumeros = valor.replace(/\D/g, "");

  // Limita a 8 caracteres
  const cepLimitado = apenasNumeros.slice(0, 8);

  // Aplica a máscara
  return cepLimitado.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

/**
 * Aplica máscara de cartão de crédito
 * @param valor Valor a receber a máscara
 * @returns String formatada (ex: 1234 5678 9012 3456)
 */
export const mascaraCartaoCredito = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não numéricos
  const apenasNumeros = valor.replace(/\D/g, "");

  // Limita a 16 caracteres (padrão mais comum)
  const cartaoLimitado = apenasNumeros.slice(0, 16);

  // Aplica a máscara em grupos de 4 dígitos
  return cartaoLimitado
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2");
};

/**
 * Aplica máscara de data
 * @param valor Valor a receber a máscara
 * @returns String formatada (ex: 31/12/2025)
 */
export const mascaraData = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não numéricos
  const apenasNumeros = valor.replace(/\D/g, "");

  // Limita a 8 caracteres (DDMMAAAA)
  const dataLimitada = apenasNumeros.slice(0, 8);

  // Aplica a máscara
  return dataLimitada
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
};

/**
 * Aplica máscara monetária (para inputs)
 * @param valor Valor a receber a máscara
 * @returns String formatada com separadores de milhar e decimal
 */
export const mascaraMoeda = (valor: string): string => {
  if (!valor) return "";

  // Remove caracteres não permitidos
  valor = valor.replace(/[^\d.,]/g, "");

  // Converte vírgula para ponto e garante no máximo um separador decimal
  const partes = valor.split(/[.,]/);
  if (partes.length > 1) {
    valor = partes[0] + "," + partes.slice(1).join("");
  }

  // Extrai a parte inteira e decimal
  let [inteira, decimal] = valor.split(",");
  inteira = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Reconstrói o valor com no máximo 2 casas decimais
  if (decimal) {
    decimal = decimal.slice(0, 2);
    return `${inteira},${decimal}`;
  }

  return inteira;
};

/**
 * Remove todas as máscaras (retorna apenas os números)
 * @param valor Valor com máscara
 * @returns String apenas com números
 */
export const removerMascara = (valor: string): string => {
  if (!valor) return "";

  // Remove todos os caracteres não numéricos
  return valor.replace(/\D/g, "");
};
