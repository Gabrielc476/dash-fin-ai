import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { sequelize } from "./models";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware";
import routes from "./routes";
import { config } from "./config/environment";

// Inicialização do app Express
const app = express();

// Middleware de segurança e logs
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Rota de verificação de saúde
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    environment: config.env,
  });
});

// Registrar todas as rotas da API
app.use("/api/v1", routes);

// Middleware para rotas não encontradas (404)
app.use(notFoundMiddleware);

// Middleware de tratamento de erros
app.use(errorMiddleware);

// Sincronizar modelos com o banco de dados
const initializeDatabase = async () => {
  try {
    if (config.env === "development") {
      // Em desenvolvimento, podemos sincronizar automaticamente
      // (cuidado: isso pode alterar a estrutura do banco de dados)
      await sequelize.sync({ alter: true });
      console.log("Database synchronized");
    } else {
      // Em produção, apenas verificar a conexão
      await sequelize.authenticate();
      console.log("Database connection established");
    }
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

// Iniciar servidor
const startServer = async () => {
  await initializeDatabase();

  const port = config.port || 8000;

  app.listen(port, () => {
    console.log(
      `Server running on ${config.env} mode at http://localhost:${port}`
    );
    console.log(`API available at http://localhost:${port}/api/v1`);
    console.log(`Health check at http://localhost:${port}/health`);
  });
};

// Iniciar aplicação
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Para tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app;
