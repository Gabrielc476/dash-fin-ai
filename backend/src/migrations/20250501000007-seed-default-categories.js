// src/migrations/20250501000007-seed-default-categories.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Esta migration será executada após a criação de todas as tabelas
    // Não cria categorias para usuários específicos pois eles ainda não existem
    // Essas categorias serão usadas como modelo para criar categorias para novos usuários
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          user_id: 0, // ID especial para indicar categoria padrão do sistema
          name: "Alimentação",
          color: "#FF5733",
          icon: "utensils",
          is_expense: true,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Transporte",
          color: "#33A8FF",
          icon: "car",
          is_expense: true,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Moradia",
          color: "#33FF57",
          icon: "home",
          is_expense: true,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Lazer",
          color: "#A833FF",
          icon: "film",
          is_expense: true,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Saúde",
          color: "#FF33A8",
          icon: "heartbeat",
          is_expense: true,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Educação",
          color: "#FFD700",
          icon: "graduation-cap",
          is_expense: true,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Salário",
          color: "#00FF00",
          icon: "money-bill",
          is_expense: false,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Freelance",
          color: "#00FFFF",
          icon: "laptop",
          is_expense: false,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 0,
          name: "Investimentos",
          color: "#FFA500",
          icon: "chart-line",
          is_expense: false,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", { user_id: 0 }, {});
  },
};
