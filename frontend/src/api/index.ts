// src/api/index.ts
import api from "./cliente";
import { authApi } from "./auth";
import { transacoesApi } from "./transacoes";
import { categoriasApi } from "./categorias";
import { orcamentosApi } from "./orcamentos";
import { relatoriosApi } from "./relatorios";
import { iaApi } from "./ia";

// Exportar todas as APIs
export {
  api, // Cliente API base
  authApi, // API de autenticação
  transacoesApi, // API de transações
  categoriasApi, // API de categorias
  orcamentosApi, // API de orçamentos
  relatoriosApi, // API de relatórios
  iaApi, // API de IA
};

// Exportação padrão do cliente API
export default api;
