// src/models/budget.model.ts
import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../config/database";

// Atributos do orçamento
interface BudgetAttributes {
  id: number;
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  recurrence?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos para criação (ID é opcional)
interface BudgetCreationAttributes
  extends Optional<
    BudgetAttributes,
    "id" | "recurrence" | "createdAt" | "updatedAt"
  > {}

class Budget
  extends Model<BudgetAttributes, BudgetCreationAttributes>
  implements BudgetAttributes
{
  public id!: number;
  public name!: string;
  public amount!: number;
  public startDate!: Date;
  public endDate!: Date;
  public recurrence?: string;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Métodos de associação
  public getUser!: BelongsToGetAssociationMixin<any>;
  public getCategories!: BelongsToManyGetAssociationsMixin<any>;
  public addCategory!: BelongsToManyAddAssociationMixin<any, number>;
  public removeCategory!: BelongsToManyRemoveAssociationMixin<any, number>;
  public setCategories!: BelongsToManySetAssociationsMixin<any, number>;
}

Budget.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    recurrence: {
      type: DataTypes.STRING(50),
      allowNull: true,
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
    tableName: "budgets",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["user_id", "start_date", "end_date"],
      },
    ],
  }
);

export default Budget;
