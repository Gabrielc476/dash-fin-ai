// src/config/sequelize.js
require("dotenv").config();

console.log("Configuração de DB sendo usada:", {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD, // Não faça isso em produção!
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "791897",
    database: process.env.DB_NAME || "financial_dashboard",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: "test_" + (process.env.DB_NAME || "financial_dashboard"),
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
