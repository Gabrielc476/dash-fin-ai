// src/models/transaction.model.ts
import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from "sequelize";
import { sequelize } from "../config/database";
import Category from "./category.model";

// Atributos da transação
interface TransactionAttributes {
  id: number;
  description: string;
  amount: number;
  date: Date;
  categoryId: number;
  userId: number;
  isExpense: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Atributos para criação (ID é opcional)
interface TransactionCreationAttributes
  extends Optional<
    TransactionAttributes,
    "id" | "paymentMethod" | "notes" | "tags" | "createdAt" | "updatedAt"
  > {}

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public description!: string;
  public amount!: number;
  public date!: Date;
  public categoryId!: number;
  public userId!: number;
  public isExpense!: boolean;
  public paymentMethod?: string;
  public notes?: string;
  public tags?: string[];
  public createdAt!: Date;
  public updatedAt!: Date;

  // Métodos de associação
  public getCategory!: BelongsToGetAssociationMixin<Category>;
  public setCategory!: BelongsToSetAssociationMixin<Category, number>;
  public getUser!: BelongsToGetAssociationMixin<any>;

  // Propriedade para categoria relacionada (adicionada para compatibilidade com TypeScript)
  public category?: Category;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      field: "category_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      field: "user_id",
    },
    isExpense: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["user_id", "date"],
        order: [["date", "DESC"]],
      },
      {
        fields: ["user_id", "category_id"],
      },
      {
        fields: ["user_id", "is_expense"],
      },
    ],
  }
);

export default Transaction;
