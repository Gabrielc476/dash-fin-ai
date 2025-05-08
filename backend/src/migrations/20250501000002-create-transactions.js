// src/migrations/20250501000002-create-transactions.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "RESTRICT",
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
      is_expense: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      payment_method: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
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

    // Índices para otimizar consultas comuns
    await queryInterface.addIndex("transactions", ["user_id", "date"], {
      order: [["date", "DESC"]],
      name: "transactions_user_id_date_desc",
    });

    await queryInterface.addIndex("transactions", ["user_id", "category_id"], {
      name: "transactions_user_id_category_id",
    });

    await queryInterface.addIndex("transactions", ["user_id", "is_expense"], {
      name: "transactions_user_id_is_expense",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transactions");
  },
};
