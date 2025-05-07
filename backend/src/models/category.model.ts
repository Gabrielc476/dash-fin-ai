// src/models/category.model.ts
import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../config/database";

// Atributos da categoria
interface CategoryAttributes {
  id: number;
  name: string;
  color: string;
  icon?: string;
  isExpense: boolean;
  isDefault: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos para criação (ID é opcional)
interface CategoryCreationAttributes
  extends Optional<
    CategoryAttributes,
    "id" | "icon" | "isDefault" | "createdAt" | "updatedAt"
  > {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public color!: string;
  public icon?: string;
  public isExpense!: boolean;
  public isDefault!: boolean;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Métodos de associação
  public getUser!: BelongsToGetAssociationMixin<any>;
  public getTransactions!: HasManyGetAssociationsMixin<any>;
  public getBudgets!: BelongsToManyGetAssociationsMixin<any>;
  public getInsights!: BelongsToManyGetAssociationsMixin<any>;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      validate: {
        is: /^#[0-9A-F]{6}$/i,
      },
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isExpense: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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
    tableName: "categories",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "name"],
      },
    ],
  }
);

export default Category;
