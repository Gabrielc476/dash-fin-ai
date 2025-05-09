// src/componentes/organismos/auth/RegistroForm/index.tsx
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { validarEmail, validarSenha } from "@/utils/validadores";
import { ERRO } from "@/constants/mensagens";

// Componentes de UI do Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componentes moleculares
import { CampoFormulario } from "@/components/moleculas/formularios/CampoFormulario";

interface RegistroFormProps {
  onSubmit: (nome: string, email: string, senha: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function RegistroForm({
  onSubmit,
  isLoading,
  error,
  clearError,
}: RegistroFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [nomeError, setNomeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [confirmarSenhaError, setConfirmarSenhaError] = useState("");

  // Limpar erros ao alterar valores nos campos
  useEffect(() => {
    if (nome) setNomeError("");
    if (email) setEmailError("");
    if (senha) setSenhaError("");
    if (confirmarSenha) setConfirmarSenhaError("");
    if (nome || email || senha || confirmarSenha) clearError();
  }, [nome, email, senha, confirmarSenha, clearError]);

  const validarFormulario = () => {
    let isValid = true;

    // Limpar erros anteriores
    setNomeError("");
    setEmailError("");
    setSenhaError("");
    setConfirmarSenhaError("");

    // Validar nome
    if (!nome) {
      setNomeError(ERRO.CAMPO_OBRIGATORIO);
      isValid = false;
    } else if (nome.length < 3) {
      setNomeError("O nome deve ter pelo menos 3 caracteres");
      isValid = false;
    }

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
    } else if (!validarSenha(senha)) {
      setSenhaError(ERRO.SENHA_FRACA);
      isValid = false;
    }

    // Validar confirmar senha
    if (!confirmarSenha) {
      setConfirmarSenhaError(ERRO.CAMPO_OBRIGATORIO);
      isValid = false;
    } else if (senha !== confirmarSenha) {
      setConfirmarSenhaError("As senhas não coincidem");
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

    await onSubmit(nome, email, senha);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CampoFormulario id="nome" label="Nome completo" error={nomeError}>
        <Input
          id="nome"
          type="text"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={isLoading}
          className={nomeError ? "border-red-500" : ""}
        />
      </CampoFormulario>

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

      <CampoFormulario
        id="senha"
        label="Senha"
        error={senhaError}
        hint={
          !senhaError
            ? "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, números e caracteres especiais."
            : undefined
        }
      >
        <Input
          id="senha"
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={isLoading}
          className={senhaError ? "border-red-500" : ""}
        />
      </CampoFormulario>

      <CampoFormulario
        id="confirmarSenha"
        label="Confirmar senha"
        error={confirmarSenhaError}
      >
        <Input
          id="confirmarSenha"
          type="password"
          placeholder="••••••••"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          disabled={isLoading}
          className={confirmarSenhaError ? "border-red-500" : ""}
        />
      </CampoFormulario>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
}
