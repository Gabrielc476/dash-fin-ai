// src/app/(private)/layout.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ROTAS } from "@/constants/rotas";
import { Sidebar } from "@/components/templates/layouts/Sidebar";
import { Header } from "@/components/templates/layouts/Header";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se não estiver autenticado e não estiver carregando, redirecionar para login
    if (!isAuthenticated && !isLoading) {
      router.push(ROTAS.PUBLIC.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  // Não mostrar nada enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Renderizar layout apenas se estiver autenticado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar currentPath={pathname} />

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header user={user} />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
