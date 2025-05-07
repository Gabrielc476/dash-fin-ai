// src/models/user.model.ts
import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
} from "sequelize";
import { sequelize } from "../config/database";
import { Transaction, Category, Budget, Insight } from "../types/models";

// Atributos do usuário
interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos para criação (ID é opcional)
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "settings" | "createdAt" | "updatedAt"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public settings!: Record<string, any>;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Métodos de associação
  public getTransactions!: HasManyGetAssociationsMixin<any>;
  public addTransaction!: HasManyAddAssociationMixin<any, number>;
  public removeTransaction!: HasManyRemoveAssociationMixin<any, number>;

  public getCategories!: HasManyGetAssociationsMixin<any>;
  public addCategory!: HasManyAddAssociationMixin<any, number>;
  public removeCategory!: HasManyRemoveAssociationMixin<any, number>;

  public getBudgets!: HasManyGetAssociationsMixin<any>;
  public addBudget!: HasManyAddAssociationMixin<any, number>;
  public removeBudget!: HasManyRemoveAssociationMixin<any, number>;

  public getInsights!: HasManyGetAssociationsMixin<any>;
  public addInsight!: HasManyAddAssociationMixin<any, number>;
  public removeInsight!: HasManyRemoveAssociationMixin<any, number>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
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
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
