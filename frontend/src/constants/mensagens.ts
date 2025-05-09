// src/constants/mensagens.ts

// Mensagens de sucesso
export const SUCESSO = {
  // Autenticação
  LOGIN: "Login realizado com sucesso!",
  REGISTRO: "Conta criada com sucesso! Bem-vindo(a)!",
  LOGOUT: "Logout realizado com sucesso!",

  // Transações
  TRANSACAO_CRIADA: "Transação criada com sucesso!",
  TRANSACAO_ATUALIZADA: "Transação atualizada com sucesso!",
  TRANSACAO_EXCLUIDA: "Transação excluída com sucesso!",

  // Categorias
  CATEGORIA_CRIADA: "Categoria criada com sucesso!",
  CATEGORIA_ATUALIZADA: "Categoria atualizada com sucesso!",
  CATEGORIA_EXCLUIDA: "Categoria excluída com sucesso!",

  // Orçamentos
  ORCAMENTO_CRIADO: "Orçamento criado com sucesso!",
  ORCAMENTO_ATUALIZADO: "Orçamento atualizado com sucesso!",
  ORCAMENTO_EXCLUIDO: "Orçamento excluído com sucesso!",

  // Relatórios
  RELATORIO_GERADO: "Relatório gerado com sucesso!",
  RELATORIO_EXPORTADO: "Relatório exportado com sucesso!",

  // Insights
  INSIGHTS_GERADOS: "Novos insights gerados com sucesso!",

  // Configurações
  CONFIGURACOES_SALVAS: "Configurações salvas com sucesso!",
  PERFIL_ATUALIZADO: "Perfil atualizado com sucesso!",
  SENHA_ALTERADA: "Senha alterada com sucesso!",
};

// Mensagens de erro
export const ERRO = {
  // Erros genéricos
  GENERICO: "Ocorreu um erro. Por favor, tente novamente.",
  CONEXAO: "Erro de conexão. Verifique sua internet e tente novamente.",
  SERVIDOR: "Erro no servidor. Por favor, tente mais tarde.",

  // Autenticação
  LOGIN: "Falha no login. Verifique suas credenciais.",
  REGISTRO: "Falha ao criar conta. Verifique os dados e tente novamente.",
  EMAIL_EXISTENTE:
    "Este email já está em uso. Tente outro ou recupere sua senha.",
  NAO_AUTORIZADO: "Você não está autorizado a acessar este recurso.",
  SESSAO_EXPIRADA: "Sua sessão expirou. Por favor, faça login novamente.",

  // Transações
  TRANSACAO_NAO_CRIADA: "Não foi possível criar a transação.",
  TRANSACAO_NAO_ATUALIZADA: "Não foi possível atualizar a transação.",
  TRANSACAO_NAO_EXCLUIDA: "Não foi possível excluir a transação.",
  TRANSACAO_NAO_ENCONTRADA: "Transação não encontrada.",

  // Categorias
  CATEGORIA_NAO_CRIADA: "Não foi possível criar a categoria.",
  CATEGORIA_NAO_ATUALIZADA: "Não foi possível atualizar a categoria.",
  CATEGORIA_NAO_EXCLUIDA: "Não foi possível excluir a categoria.",
  CATEGORIA_NAO_ENCONTRADA: "Categoria não encontrada.",
  CATEGORIA_PADRAO: "Não é possível excluir categorias padrão.",
  CATEGORIA_NOME_EXISTENTE: "Já existe uma categoria com este nome.",

  // Orçamentos
  ORCAMENTO_NAO_CRIADO: "Não foi possível criar o orçamento.",
  ORCAMENTO_NAO_ATUALIZADO: "Não foi possível atualizar o orçamento.",
  ORCAMENTO_NAO_EXCLUIDO: "Não foi possível excluir o orçamento.",
  ORCAMENTO_NAO_ENCONTRADO: "Orçamento não encontrado.",
  ORCAMENTO_DATAS_INVALIDAS: "As datas do orçamento são inválidas.",

  // Relatórios
  RELATORIO_NAO_GERADO: "Não foi possível gerar o relatório.",
  RELATORIO_NAO_EXPORTADO: "Não foi possível exportar o relatório.",

  // Insights
  INSIGHTS_NAO_GERADOS: "Não foi possível gerar novos insights.",
  INSIGHT_NAO_ENCONTRADO: "Insight não encontrado.",

  // Validação
  CAMPO_OBRIGATORIO: "Este campo é obrigatório.",
  DATA_INVALIDA: "Data inválida.",
  VALOR_INVALIDO: "Valor inválido.",
  EMAIL_INVALIDO: "Email inválido.",
  SENHA_FRACA: "A senha deve ter pelo menos 8 caracteres.",
};

// Mensagens de confirmação
export const CONFIRMACAO = {
  EXCLUIR_TRANSACAO: "Tem certeza que deseja excluir esta transação?",
  EXCLUIR_CATEGORIA: "Tem certeza que deseja excluir esta categoria?",
  EXCLUIR_ORCAMENTO: "Tem certeza que deseja excluir este orçamento?",
  SAIR: "Tem certeza que deseja sair?",
};

// Mensagens informativas
export const INFO = {
  CARREGANDO: "Carregando...",
  SEM_DADOS: "Nenhum dado encontrado.",
  SEM_TRANSACOES: "Nenhuma transação encontrada.",
  SEM_CATEGORIAS: "Nenhuma categoria encontrada.",
  SEM_ORCAMENTOS: "Nenhum orçamento encontrado.",
  SEM_INSIGHTS: "Nenhum insight encontrado.",
  DADOS_INSUFICIENTES: "Dados insuficientes para gerar o relatório.",
  GERANDO_INSIGHTS:
    "Gerando insights com IA. Isso pode levar alguns instantes...",
  LIMITE_ORCAMENTO: "Você está próximo do limite do orçamento!",
  ORCAMENTO_EXCEDIDO: "Você excedeu o orçamento!",
};

// Mensagens para tooltips
export const TOOLTIP = {
  ADICIONAR_TRANSACAO: "Adicionar nova transação",
  EDITAR_TRANSACAO: "Editar transação",
  EXCLUIR_TRANSACAO: "Excluir transação",
  FILTRAR_TRANSACOES: "Filtrar transações",

  ADICIONAR_CATEGORIA: "Adicionar nova categoria",
  EDITAR_CATEGORIA: "Editar categoria",
  EXCLUIR_CATEGORIA: "Excluir categoria",

  ADICIONAR_ORCAMENTO: "Adicionar novo orçamento",
  EDITAR_ORCAMENTO: "Editar orçamento",
  EXCLUIR_ORCAMENTO: "Excluir orçamento",
  VER_PROGRESSO: "Ver progresso do orçamento",

  GERAR_RELATORIO: "Gerar relatório",
  EXPORTAR_RELATORIO: "Exportar relatório",

  GERAR_INSIGHTS: "Gerar novos insights com IA",

  CONFIGURACOES: "Configurações da conta",
  PERFIL: "Ver perfil",
  SAIR: "Sair da conta",
};
