// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth.routes";
// Os imports abaixo serão descomentados à medida que as rotas forem implementadas
import transactionRoutes from "./transactions.routes";
import categoryRoutes from "./categories.routes";
import budgetRoutes from "./budgets.routes";
import reportRoutes from "./reports.routes";
import aiInsightRoutes from "./ai-insights.routes";

const router = Router();

// Registrar todas as rotas
router.use("/auth", authRoutes);
// As linhas abaixo serão descomentadas à medida que as rotas forem implementadas
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/budgets", budgetRoutes);
router.use("/reports", reportRoutes);
router.use("/ai", aiInsightRoutes);

export default router;
