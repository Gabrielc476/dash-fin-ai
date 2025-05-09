// src/componentes/organismos/auth/LoginForm/index.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { validarEmail } from "@/utils/validadores";
import { ROTAS } from "@/constants/rotas";
import { ERRO } from "@/constants/mensagens";

// Componentes de UI do Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componentes moleculares
import { CampoFormulario } from "@/components/moleculas/formularios/CampoFormulario";

interface LoginFormProps {
  onSubmit: (email: string, senha: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function LoginForm({
  onSubmit,
  isLoading,
  error,
  clearError,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  // Limpar erros ao alterar valores nos campos
  useEffect(() => {
    if (email) setEmailError("");
    if (senha) setSenhaError("");
    if (email || senha) clearError();
  }, [email, senha, clearError]);

  const validarFormulario = () => {
    let isValid = true;

    // Limpar erros anteriores
    setEmailError("");
    setSenhaError("");

    // Validar email
    if (!email) {
      setEmailError(ERRO.CAMPO_OBRIGATORIO);
      isValid = false;
    } else if (!validarEmail(email)) {
      setEmailError(ERRO.EMAIL_INVALIDO);
      isValid = false;
    }

    // Validar senha
    if (!senha) {
      setSenhaError(ERRO.CAMPO_OBRIGATORIO);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validarFormulario()) {
      return;
    }

    await onSubmit(email, senha);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CampoFormulario id="email" label="Email" error={emailError}>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className={emailError ? "border-red-500" : ""}
        />
      </CampoFormulario>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="senha">Senha</Label>
          <Link
            href={ROTAS.PUBLIC.ESQUECI_SENHA}
            className="text-sm text-primary hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          id="senha"
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={isLoading}
          className={senhaError ? "border-red-500" : ""}
        />
        {senhaError && <p className="text-red-500 text-sm">{senhaError}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
