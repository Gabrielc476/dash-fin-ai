// src/migrations/20250501000004-create-budget-categories.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("budget_categories", {
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "budgets",
          key: "id",
        },
        onDelete: "CASCADE",
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "CASCADE",
        primaryKey: true,
      },
    });

    // Índice para melhorar consultas
    await queryInterface.addIndex("budget_categories", ["category_id"], {
      name: "budget_categories_category_id",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("budget_categories");
  },
};
