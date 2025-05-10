// src/components/templates/layouts/Sidebar.tsx
"use client";

import Link from "next/link";
import { ROTAS } from "@/constants/rotas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Receipt,
  Tag,
  Calculator,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  currentPath: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: ROTAS.PRIVATE.DASHBOARD,
    icon: Home,
  },
  {
    title: "Transações",
    href: ROTAS.PRIVATE.TRANSACOES.LISTAR,
    icon: Receipt,
  },
  {
    title: "Categorias",
    href: ROTAS.PRIVATE.CATEGORIAS.LISTAR,
    icon: Tag,
  },
  {
    title: "Orçamentos",
    href: ROTAS.PRIVATE.ORCAMENTOS.LISTAR,
    icon: Calculator,
  },
  {
    title: "Relatórios",
    href: ROTAS.PRIVATE.RELATORIOS.INICIO,
    icon: BarChart3,
  },
  {
    title: "Insights",
    href: ROTAS.PRIVATE.INSIGHTS.LISTAR,
    icon: Sparkles,
  },
];

export function Sidebar({ currentPath }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              DF
            </div>
            <span className="font-semibold">Dashboard Financeiro</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(isCollapsed ? "mx-auto" : "")}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-primary/10 text-primary",
                      isCollapsed && "px-2"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t">
        <Link href={ROTAS.PRIVATE.CONFIGURACOES}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              currentPath === ROTAS.PRIVATE.CONFIGURACOES &&
                "bg-primary/10 text-primary",
              isCollapsed && "px-2"
            )}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Configurações</span>}
          </Button>
        </Link>

        <Button
          variant="ghost"
          className={cn("w-full justify-start mt-2", isCollapsed && "px-2")}
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  );
}
