// src/migrations/20250501000003-create-budgets.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("budgets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      recurrence: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Índices para consultas
    await queryInterface.addIndex("budgets", ["user_id"], {
      name: "budgets_user_id",
    });

    await queryInterface.addIndex(
      "budgets",
      ["user_id", "start_date", "end_date"],
      {
        name: "budgets_user_id_dates",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("budgets");
  },
};
