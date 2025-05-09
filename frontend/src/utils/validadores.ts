// src/utils/validadores.ts

/**
 * Verifica se um valor é nulo ou vazio
 * @param valor Valor a ser verificado
 * @returns Boolean indicando se o valor é nulo ou vazio
 */
export const estaVazio = (valor: any): boolean => {
  if (valor === null || valor === undefined) return true;

  if (typeof valor === "string") return valor.trim() === "";

  if (Array.isArray(valor)) return valor.length === 0;

  if (typeof valor === "object") return Object.keys(valor).length === 0;

  return false;
};

/**
 * Valida um email
 * @param email Email a ser validado
 * @returns Boolean indicando se o email é válido
 */
export const validarEmail = (email: string): boolean => {
  if (!email) return false;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida uma senha conforme critérios especificados
 * @param senha Senha a ser validada
 * @param minCaracteres Número mínimo de caracteres
 * @param requerMaiuscula Se requer ao menos uma letra maiúscula
 * @param requerNumero Se requer ao menos um número
 * @param requerEspecial Se requer ao menos um caractere especial
 * @returns Boolean indicando se a senha é válida
 */
export const validarSenha = (
  senha: string,
  minCaracteres = 8,
  requerMaiuscula = true,
  requerNumero = true,
  requerEspecial = true
): boolean => {
  if (!senha) return false;

  // Verifica tamanho mínimo
  if (senha.length < minCaracteres) return false;

  // Verifica se requer letra maiúscula
  if (requerMaiuscula && !/[A-Z]/.test(senha)) return false;

  // Verifica se requer número
  if (requerNumero && !/[0-9]/.test(senha)) return false;

  // Verifica se requer caractere especial
  if (requerEspecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha))
    return false;

  return true;
};

/**
 * Verifica se dois valores são iguais
 * @param valor1 Primeiro valor
 * @param valor2 Segundo valor
 * @returns Boolean indicando se os valores são iguais
 */
export const saoIguais = (valor1: any, valor2: any): boolean => {
  return JSON.stringify(valor1) === JSON.stringify(valor2);
};

/**
 * Valida um CPF
 * @param cpf CPF a ser validado (pode conter pontuação)
 * @returns Boolean indicando se o CPF é válido
 */
export const validarCPF = (cpf: string): boolean => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido, mas passaria na validação)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

  return digitoVerificador2 === parseInt(cpf.charAt(10));
};

/**
 * Valida um CNPJ
 * @param cnpj CNPJ a ser validado (pode conter pontuação)
 * @returns Boolean indicando se o CNPJ é válido
 */
export const validarCNPJ = (cnpj: string): boolean => {
  if (!cnpj) return false;

  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, "");

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais (CNPJ inválido, mas passaria na validação)
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Validação do primeiro dígito verificador
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  // Validação do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  return resultado === parseInt(digitos.charAt(1));
};

/**
 * Valida um número de cartão de crédito usando algoritmo de Luhn
 * @param numeroCartao Número do cartão a ser validado
 * @returns Boolean indicando se o número é válido
 */
export const validarCartaoCredito = (numeroCartao: string): boolean => {
  if (!numeroCartao) return false;

  // Remove espaços e traços
  numeroCartao = numeroCartao.replace(/[\s-]/g, "");

  // Verifica se contém apenas dígitos
  if (!/^\d+$/.test(numeroCartao)) return false;

  // Verifica tamanho (a maioria dos cartões tem entre 13 e 19 dígitos)
  if (numeroCartao.length < 13 || numeroCartao.length > 19) return false;

  // Algoritmo de Luhn
  let soma = 0;
  let deveDobrar = false;

  for (let i = numeroCartao.length - 1; i >= 0; i--) {
    let digito = parseInt(numeroCartao.charAt(i));

    if (deveDobrar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }

    soma += digito;
    deveDobrar = !deveDobrar;
  }

  return soma % 10 === 0;
};

/**
 * Valida um valor monetário
 * @param valor Valor a ser validado
 * @param min Valor mínimo permitido
 * @param max Valor máximo permitido
 * @returns Boolean indicando se o valor é válido
 */
export const validarValorMonetario = (
  valor: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
): boolean => {
  if (valor === null || valor === undefined || isNaN(valor)) return false;

  return valor >= min && valor <= max;
};

/**
 * Valida um número de telefone
 * @param telefone Número de telefone a ser validado
 * @returns Boolean indicando se o telefone é válido
 */
export const validarTelefone = (telefone: string): boolean => {
  if (!telefone) return false;

  // Remove caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, "");

  // Verifica tamanho (8 a 11 dígitos)
  return numeroLimpo.length >= 8 && numeroLimpo.length <= 11;
};

/**
 * Valida uma data
 * @param data Data a ser validada (objeto Date ou string no formato ISO)
 * @param minData Data mínima permitida
 * @param maxData Data máxima permitida
 * @returns Boolean indicando se a data é válida
 */
export const validarData = (
  data: Date | string,
  minData: Date | null = null,
  maxData: Date | null = null
): boolean => {
  if (!data) return false;

  // Converte para objeto Date, se for string
  const dataObj = typeof data === "string" ? new Date(data) : data;

  // Verifica se é uma data válida
  if (isNaN(dataObj.getTime())) return false;

  // Verifica data mínima
  if (minData && dataObj < minData) return false;

  // Verifica data máxima
  if (maxData && dataObj > maxData) return false;

  return true;
};

/**
 * Valida se um URL é válido
 * @param url URL a ser validado
 * @returns Boolean indicando se o URL é válido
 */
export const validarURL = (url: string): boolean => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida um CEP
 * @param cep CEP a ser validado
 * @returns Boolean indicando se o CEP é válido
 */
export const validarCEP = (cep: string): boolean => {
  if (!cep) return false;

  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, "");

  // Verifica tamanho (8 dígitos)
  return cepLimpo.length === 8;
};
