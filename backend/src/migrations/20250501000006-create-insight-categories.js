// src/migrations/20250501000006-create-insight-categories.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("insight_categories", {
      insight_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "insights",
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
    await queryInterface.addIndex("insight_categories", ["category_id"], {
      name: "insight_categories_category_id",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("insight_categories");
  },
};
