"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { validarEmail } from "@/utils/validadores";
import { ROTAS } from "@/constants/rotas";
import { ERRO } from "@/constants/mensagens";

// Componentes de UI do Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componentes específicos para autenticação
import { LoginForm } from "@/components/organismos/auth/LoginForm";
import { AutenticacaoTemplate } from "@/components/templates/AutenticacaoTemplate";

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async (email: string, senha: string) => {
    const success = await login({ email, password: senha });
    if (success) {
      router.push(ROTAS.PRIVATE.DASHBOARD);
    }
  };

  return (
    <AutenticacaoTemplate
      titulo="Login"
      descricao="Faça login na sua conta para acessar o dashboard"
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
      />

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href={ROTAS.PUBLIC.REGISTRO}
            className="text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </AutenticacaoTemplate>
  );
}
