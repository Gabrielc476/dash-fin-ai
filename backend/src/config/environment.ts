// src/config/environment.ts
import dotenv from "dotenv";
import path from "path";

// Carrega variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Define tipos para as configurações
interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  ssl: boolean;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface Config {
  env: string;
  port: number;
  corsOrigins: string | string[];
  database: DatabaseConfig;
  jwt: JwtConfig;
  anthropicApiKey: string;
}

// Analisa e valida valores de ambiente
const parseEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
};

// Cria o objeto de configuração
export const config: Config = {
  env: parseEnvVar("NODE_ENV", "development"),
  port: parseInt(parseEnvVar("PORT", "8000"), 10),
  corsOrigins: parseEnvVar("CORS_ORIGINS", "*").split(","),

  database: {
    host: parseEnvVar("DB_HOST", "localhost"),
    port: parseInt(parseEnvVar("DB_PORT", "5432"), 10),
    username: parseEnvVar("DB_USERNAME", "postgres"),
    password: parseEnvVar("DB_PASSWORD", "postgres"),
    name: parseEnvVar("DB_NAME", "financial_dashboard"),
    ssl: parseEnvVar("DB_SSL", "false") === "true",
  },

  jwt: {
    secret: parseEnvVar("JWT_SECRET", "your-secret-key-for-development-only"),
    expiresIn: parseEnvVar("JWT_EXPIRES_IN", "7d"),
  },

  anthropicApiKey: parseEnvVar("ANTHROPIC_API_KEY"),
};

// Valida a configuração em modo de produção
if (config.env === "production") {
  if (config.jwt.secret === "your-secret-key-for-development-only") {
    throw new Error("Production environment must have a secure JWT_SECRET");
  }

  if (config.corsOrigins === "*") {
    console.warn(
      "Warning: CORS is configured to allow all origins in production"
    );
  }
}
