"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROTAS } from "@/constants/rotas";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [currentDate] = useState(new Date());

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROTAS.PUBLIC.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              DF
            </div>
            <span className="font-bold">Dashboard Financeiro</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">Olá, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden md:block">
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
              Dashboard
            </div>
            <div className="px-3 py-2 rounded-md text-muted-foreground hover:bg-accent">
              Transações
            </div>
            <div className="px-3 py-2 rounded-md text-muted-foreground hover:bg-accent">
              Categorias
            </div>
            <div className="px-3 py-2 rounded-md text-muted-foreground hover:bg-accent">
              Orçamentos
            </div>
            <div className="px-3 py-2 rounded-md text-muted-foreground hover:bg-accent">
              Relatórios
            </div>
            <div className="px-3 py-2 rounded-md text-muted-foreground hover:bg-accent">
              Insights
            </div>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="bg-card border rounded-lg p-6 mb-6">
              <p className="text-lg font-medium mb-2">
                Bem-vindo ao Dashboard Financeiro!
              </p>
              <p className="text-muted-foreground">
                Este é um placeholder para o dashboard. Aqui serão exibidos
                gráficos, resumos financeiros e outras informações importantes.
              </p>
              <p className="text-muted-foreground mt-2">
                Data atual: {currentDate.toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Saldo Atual
                </h3>
                <p className="text-2xl font-bold">R$ 4.250,00</p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Receitas (Maio)
                </h3>
                <p className="text-2xl font-bold text-green-600">R$ 6.500,00</p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Despesas (Maio)
                </h3>
                <p className="text-2xl font-bold text-red-600">R$ 3.780,00</p>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 flex items-center justify-center h-80 mb-6">
              <p className="text-muted-foreground">
                Aqui será exibido o gráfico de despesas por categoria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-medium mb-4">Últimas Transações</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">Supermercado</p>
                      <p className="text-sm text-muted-foreground">
                        Alimentação
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-R$ 250,00</p>
                      <p className="text-sm text-muted-foreground">Hoje</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">Salário</p>
                      <p className="text-sm text-muted-foreground">Receita</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+R$ 3.500,00</p>
                      <p className="text-sm text-muted-foreground">Ontem</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Internet</p>
                      <p className="text-sm text-muted-foreground">Moradia</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-R$ 120,00</p>
                      <p className="text-sm text-muted-foreground">
                        3 dias atrás
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-medium mb-4">Orçamentos</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">Alimentação</p>
                      <p className="text-sm">R$ 560 / R$ 800</p>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">Lazer</p>
                      <p className="text-sm">R$ 320 / R$ 300</p>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full"
                        style={{ width: "105%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">Transporte</p>
                      <p className="text-sm">R$ 120 / R$ 400</p>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-card border-t px-6 py-4 text-center text-sm text-muted-foreground">
        <p>© {currentDate.getFullYear()} Dashboard Financeiro</p>
      </footer>
    </div>
  );
}
