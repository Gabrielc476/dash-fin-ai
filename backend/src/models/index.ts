// src/models/index.ts
import { sequelize } from "../config/database";
import User from "./user.model";
import Category from "./category.model";
import Transaction from "./transaction.model";
import Budget from "./budget.model";
import Insight from "./insight.model";

// Definir as associações entre modelos
User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transactions",
});
Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Category, {
  foreignKey: "userId",
  as: "categories",
});
Category.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Category.hasMany(Transaction, {
  foreignKey: "categoryId",
  as: "transactions",
});
Transaction.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

User.hasMany(Budget, {
  foreignKey: "userId",
  as: "budgets",
});
Budget.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Insight, {
  foreignKey: "userId",
  as: "insights",
});
Insight.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Tabela de associação entre Budget e Category (muitos-para-muitos)
const BudgetCategory = sequelize.define(
  "budget_category",
  {},
  { timestamps: false }
);
Budget.belongsToMany(Category, { through: BudgetCategory, as: "categories" });
Category.belongsToMany(Budget, { through: BudgetCategory, as: "budgets" });

// Tabela de associação entre Insight e Category (muitos-para-muitos)
const InsightCategory = sequelize.define(
  "insight_category",
  {},
  { timestamps: false }
);
Insight.belongsToMany(Category, { through: InsightCategory, as: "categories" });
Category.belongsToMany(Insight, { through: InsightCategory, as: "insights" });

export {
  sequelize,
  User,
  Category,
  Transaction,
  Budget,
  Insight,
  BudgetCategory,
  InsightCategory,
};
