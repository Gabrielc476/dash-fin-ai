"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatarMoeda } from "@/utils/formatadores";

// Sample data - in a real app, this would come from API
const sampleTransactions = [
  {
    id: 1,
    description: "Salário",
    amount: 5000,
    type: "income",
    category: "Receita",
    date: "2025-05-01",
    color: "#4CAF50",
  },
  {
    id: 2,
    description: "Aluguel",
    amount: 1200,
    type: "expense",
    category: "Moradia",
    date: "2025-05-05",
    color: "#FF5733",
  },
  {
    id: 3,
    description: "Supermercado",
    amount: 450,
    type: "expense",
    category: "Alimentação",
    date: "2025-05-07",
    color: "#FF9800",
  },
  {
    id: 4,
    description: "Internet",
    amount: 120,
    type: "expense",
    category: "Serviços",
    date: "2025-05-10",
    color: "#9C27B0",
  },
  {
    id: 5,
    description: "Freelance",
    amount: 1500,
    type: "income",
    category: "Receita Extra",
    date: "2025-05-15",
    color: "#2196F3",
  },
  {
    id: 6,
    description: "Restaurante",
    amount: 180,
    type: "expense",
    category: "Alimentação",
    date: "2025-05-18",
    color: "#FF9800",
  },
  {
    id: 7,
    description: "Combustível",
    amount: 200,
    type: "expense",
    category: "Transporte",
    date: "2025-05-20",
    color: "#3F51B5",
  },
];

const sampleExpensesByCategory = [
  { name: "Moradia", value: 1200, color: "#FF5733" },
  { name: "Alimentação", value: 630, color: "#FF9800" },
  { name: "Serviços", value: 120, color: "#9C27B0" },
  { name: "Transporte", value: 200, color: "#3F51B5" },
  { name: "Outros", value: 180, color: "#607D8B" },
];

const monthlyData = [
  { name: "Jan", income: 4500, expenses: 3200 },
  { name: "Fev", income: 4500, expenses: 2800 },
  { name: "Mar", income: 5000, expenses: 3400 },
  { name: "Abr", income: 5000, expenses: 3100 },
  { name: "Mai", income: 6500, expenses: 3780 },
  { name: "Jun", income: 4800, expenses: 2900 },
];

const budgets = [
  { name: "Alimentação", current: 630, max: 800, percent: 79 },
  { name: "Transporte", current: 200, max: 400, percent: 50 },
  { name: "Lazer", current: 320, max: 300, percent: 107 },
];

// Insights examples
const insights = [
  {
    title: "Gastos com alimentação aumentaram",
    description:
      "Seus gastos com alimentação subiram 15% em relação ao mês anterior.",
    impact: -150,
    relevance: 8.5,
  },
  {
    title: "Economize em serviços",
    description:
      "Você poderia economizar R$ 80/mês renegociando seu plano de internet.",
    impact: 80,
    relevance: 7.5,
  },
];

const FinancialDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate] = useState(new Date());

  // Get current month name and year
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Calculate totals
  const income = sampleTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = sampleTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              DF
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">
              Dashboard Financeiro
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline-block">Olá, Usuário</span>
          <Button variant="ghost" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-0 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-200 ease-in-out z-10 bg-background border-r w-64 pt-4 pb-4 flex flex-col`}
        >
          <div className="px-4 mb-2 md:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                DF
              </div>
              <span className="font-semibold text-lg">Dashboard</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <nav className="px-2 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    setActiveSection("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    activeSection === "dashboard"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("transactions");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    activeSection === "transactions"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M2 17h2.4a2 2 0 0 0 1.4-.6l7.4-7.5a2.1 2.1 0 0 1 3 0l4.6 4.6a2.1 2.1 0 0 0 3 0L22 15"></path>
                    <path d="m15 8-3-3-9 9v3h3l9-9Z"></path>
                  </svg>
                  Transações
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("categories");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    activeSection === "categories"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                  Categorias
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("budgets");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    activeSection === "budgets"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M20.2 7.8 14 1.6"></path>
                    <path d="M16 7V3h4"></path>
                    <path d="M4 12h8"></path>
                    <path d="M4 16h16"></path>
                    <path d="M4 20h16"></path>
                  </svg>
                  Orçamentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("reports");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    activeSection === "reports"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                  Relatórios
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("insights");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    activeSection === "insights"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  Insights IA
                </button>
              </li>
            </ul>
          </nav>

          <div className="border-t mt-auto pt-4 px-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Configurações
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Title and current month */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="text-sm text-muted-foreground">
                {currentMonth}, {currentYear}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Receitas
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatarMoeda(income)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Despesas
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatarMoeda(expenses)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Saldo
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatarMoeda(balance)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sampleExpensesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {sampleExpensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatarMoeda(value as number)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receitas vs Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatarMoeda(value as number)}
                        />
                        <Legend />
                        <Bar dataKey="income" name="Receitas" fill="#4CAF50" />
                        <Bar
                          dataKey="expenses"
                          name="Despesas"
                          fill="#FF5733"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Last rows - Recent transactions and budgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleTransactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center pb-2 border-b"
                      >
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={
                              transaction.type === "expense"
                                ? "text-red-600 font-medium"
                                : "text-green-600 font-medium"
                            }
                          >
                            {transaction.type === "expense" ? "-" : "+"}
                            {formatarMoeda(transaction.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todas as transações
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Orçamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {budgets.map((budget, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{budget.name}</span>
                          <span className="text-sm">
                            {formatarMoeda(budget.current)} /{" "}
                            {formatarMoeda(budget.max)}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              budget.percent > 100
                                ? "bg-red-600"
                                : budget.percent > 80
                                ? "bg-amber-500"
                                : "bg-primary"
                            }`}
                            style={{
                              width: `${Math.min(budget.percent, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Gerenciar orçamentos
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* IA Insights Section */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Insights com IA</CardTitle>
                  <CardDescription>
                    Recomendações personalizadas baseadas em Claude 3.7
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <Alert key={index} className="bg-card border">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold">{insight.title}</div>
                          <AlertDescription>
                            {insight.description}
                          </AlertDescription>
                          <div className="mt-2 flex justify-between items-center">
                            {insight.impact !== undefined && (
                              <span
                                className={`text-sm font-medium ${
                                  insight.impact > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                Impacto: {insight.impact > 0 ? "+" : ""}
                                {formatarMoeda(insight.impact)}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Relevância: {insight.relevance}/10
                            </span>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Gerar novos insights</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-card border-t px-6 py-4 text-center text-sm text-muted-foreground">
        <p>© {currentDate.getFullYear()} Dashboard Financeiro</p>
      </footer>
    </div>
  );
};

export default FinancialDashboard;
