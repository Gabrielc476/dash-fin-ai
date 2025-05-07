// src/models/insight.model.ts
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

// Atributos do insight
interface InsightAttributes {
  id: number;
  type: string;
  title: string;
  description: string;
  impactValue?: number;
  relevanceScore: number;
  userId: number;
  createdAt: Date;
}

// Atributos para criação (ID é opcional)
interface InsightCreationAttributes
  extends Optional<InsightAttributes, "id" | "impactValue" | "createdAt"> {}

class Insight
  extends Model<InsightAttributes, InsightCreationAttributes>
  implements InsightAttributes
{
  public id!: number;
  public type!: string;
  public title!: string;
  public description!: string;
  public impactValue?: number;
  public relevanceScore!: number;
  public userId!: number;
  public createdAt!: Date;

  // Métodos de associação
  public getUser!: BelongsToGetAssociationMixin<any>;
  public getCategories!: BelongsToManyGetAssociationsMixin<any>;
  public addCategory!: BelongsToManyAddAssociationMixin<any, number>;
  public removeCategory!: BelongsToManyRemoveAssociationMixin<any, number>;
  public setCategories!: BelongsToManySetAssociationsMixin<any, number>;
}

Insight.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    impactValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "impact_value",
    },
    relevanceScore: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      field: "relevance_score",
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
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "insights",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["user_id", "relevance_score"],
        order: [["relevance_score", "DESC"]],
      },
    ],
  }
);

export default Insight;
