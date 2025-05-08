// src/migrations/20250501000001-create-categories.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_expense: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    // Adicionar índice para usuário
    await queryInterface.addIndex("categories", ["user_id"]);

    // Adicionar índice único para nome de categoria por usuário
    await queryInterface.addIndex("categories", ["user_id", "name"], {
      unique: true,
      name: "categories_user_id_name_unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("categories");
  },
};
