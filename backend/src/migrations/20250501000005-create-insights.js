// src/migrations/20250501000005-create-insights.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("insights", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      impact_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      relevance_score: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
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
    });

    // Índices para consultas por usuário e relevância
    await queryInterface.addIndex("insights", ["user_id"], {
      name: "insights_user_id",
    });

    await queryInterface.addIndex("insights", ["user_id", "relevance_score"], {
      name: "insights_user_id_relevance",
      order: [["relevance_score", "DESC"]],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("insights");
  },
};
