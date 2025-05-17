# Dashboard Financeiro

## 📊 Visão Geral

Dashboard Financeiro é uma aplicação web full-stack para análise e gerenciamento de finanças pessoais ou empresariais, utilizando inteligência artificial para fornecer insights personalizados. O sistema permite categorizar transações, visualizar dados através de gráficos interativos, gerenciar orçamentos e receber recomendações inteligentes baseadas na análise do Claude 3.7.

## ✨ Funcionalidades

- **Rastreamento de Gastos**: Registre e categorize transações automáticamente
- **Análise Visual**: Visualize dados financeiros com gráficos interativos
- **Gerenciamento de Orçamentos**: Crie e monitore orçamentos por categoria
- **Previsões Financeiras**: Obtenha análises de tendências baseadas em dados históricos
- **Insights de IA**: Receba sugestões personalizadas do Claude 3.7
- **Exportação de Relatórios**: Gere relatórios em diversos formatos

## 🛠️ Tecnologias

### Frontend
- Next.js 14 com App Router
- TypeScript
- Shadcn UI / TailwindCSS
- Recharts para visualização de dados

### Backend
- Express.js / Node.js
- PostgreSQL com Sequelize ORM
- JWT para autenticação
- API REST

### Inteligência Artificial
- Claude 3.7 com Extended Thinking
- Análise financeira avançada

## ⚙️ Instalação

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- Docker e Docker Compose (opcional)
- Chave API da Anthropic (Claude 3.7)

### Com Docker

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/dashboard-financeiro.git
cd dashboard-financeiro

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar com Docker Compose
docker-compose up -d
```

### Instalação Manual

#### Backend

```bash
cd dashboard-financeiro/backend
npm install
cp .env.example .env
# Edite o arquivo .env

# Executar migrações
npm run migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

#### Frontend

```bash
cd dashboard-financeiro/frontend
npm install
cp .env.example .env.local
# Edite o arquivo .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
dashboard-financeiro/
├── backend/                # API Express.js
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços, incluindo IA
│   │   └── utils/          # Funções utilitárias
│   └── ...
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/            # App Router
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── api/            # Cliente de API
│   │   └── utils/          # Funções utilitárias
│   └── ...
└── ...
```

## 🌐 API

O sistema possui uma API RESTful com os seguintes endpoints principais:

### Autenticação
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login

### Transações
- `GET /api/v1/transactions` - Listar
- `POST /api/v1/transactions` - Criar
- `PUT /api/v1/transactions/:id` - Atualizar
- `DELETE /api/v1/transactions/:id` - Excluir

### Orçamentos e Categorias
- `GET /api/v1/budgets` - Listar orçamentos
- `GET /api/v1/categories` - Listar categorias

### Insights de IA
- `POST /api/v1/ai/insights/generate` - Gerar insights
- `GET /api/v1/ai/forecast` - Previsão de gastos

## 👥 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
