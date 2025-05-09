"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROTAS } from "@/constants/rotas";

// Componentes específicos para autenticação
import { RegistroForm } from "@/components/organismos/auth/RegistroForm";
import { AutenticacaoTemplate } from "@/components/templates/AutenticacaoTemplate";

export default function Registro() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  const handleRegistro = async (nome: string, email: string, senha: string) => {
    const success = await register({
      name: nome,
      email,
      password: senha,
    });

    if (success) {
      router.push(ROTAS.PRIVATE.DASHBOARD);
    }
  };

  return (
    <AutenticacaoTemplate
      titulo="Criar Conta"
      descricao="Preencha os campos abaixo para criar sua conta no sistema"
    >
      <RegistroForm
        onSubmit={handleRegistro}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
      />

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href={ROTAS.PUBLIC.LOGIN}
            className="text-primary hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </AutenticacaoTemplate>
  );
}
