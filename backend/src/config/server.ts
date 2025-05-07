// src/config/server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "../middleware/error.middleware";
import { config } from "./enviroment";

// Remova a importação do swagger que está causando o erro
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '../docs/swagger.json';

const createServer = () => {
  const app = express();

  // Configurações de segurança
  app.use(helmet());

  // Configuração CORS
  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Middleware para logs de requisições
  app.use(morgan(config.env === "development" ? "dev" : "combined"));

  // Parsing de JSON no corpo das requisições
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Swagger será configurado posteriormente quando você tiver o arquivo
  /* 
  if (config.env !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
  */

  // Middleware para tratamento de erros (a ser utilizado após as rotas)
  app.use(errorMiddleware);

  // Verificação de saúde da API
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
  });

  return app;
};

export { createServer };
