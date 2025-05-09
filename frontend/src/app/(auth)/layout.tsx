"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROTAS } from "@/constants/rotas";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já está autenticado, redirecionar para o dashboard
    if (isAuthenticated && !isLoading) {
      router.push(ROTAS.PRIVATE.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  // Não mostrar nada enquanto verificamos o estado de autenticação
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

  // Renderizar os componentes filhos apenas se usuário não estiver autenticado
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Retornar null enquanto redireciona
  return null;
}
