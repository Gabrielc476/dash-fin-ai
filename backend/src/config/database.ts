// src/config/database.ts
import { Sequelize } from "sequelize";
import { config } from "./environment";

const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: "postgres",
    logging: config.env === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: config.database.ssl
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
  }
);

export { sequelize };
