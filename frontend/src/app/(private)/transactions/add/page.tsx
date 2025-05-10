// frontend/src/app/(private)/transactions/add/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransacoes } from "@/hooks";
import { ROTAS } from "@/constants/rotas";
import { FormularioTransacao } from "@/components/organismos/transacoes/FormularioTransacao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NovaTransacaoPage() {
  const router = useRouter();
  const { criarTransacao, isLoading, error } = useTransacoes();

  const handleCriarTransacao = async (dados: any) => {
    const sucesso = await criarTransacao(dados);
    if (sucesso) {
      router.push(ROTAS.PRIVATE.TRANSACOES.LISTAR);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.LISTAR)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Transação</h1>
          <p className="text-muted-foreground">
            Adicione uma nova receita ou despesa
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioTransacao
            onSubmit={handleCriarTransacao}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
