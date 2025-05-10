// frontend/src/app/(private)/transactions/[id]/edit/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useTransacoes } from "@/hooks";
import { ROTAS } from "@/constants/rotas";
import { FormularioTransacao } from "@/components/organismos/transacoes/FormularioTransacao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditarTransacaoPage() {
  const router = useRouter();
  const params = useParams();
  const {
    transacaoAtual,
    buscarTransacaoPorId,
    atualizarTransacao,
    isLoading,
    error,
  } = useTransacoes();

  useEffect(() => {
    if (params.id) {
      buscarTransacaoPorId(params.id as string);
    }
  }, [params.id]);

  const handleAtualizarTransacao = async (dados: any) => {
    const sucesso = await atualizarTransacao(params.id as string, dados);
    if (sucesso) {
      router.push(ROTAS.PRIVATE.TRANSACOES.LISTAR);
    }
  };

  if (isLoading && !transacaoAtual) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transacaoAtual) {
    return <div>Transação não encontrada</div>;
  }

  const dadosIniciais = {
    description: transacaoAtual.description,
    amount: transacaoAtual.amount.toString(),
    date: new Date(transacaoAtual.date).toISOString().split("T")[0],
    categoryId: transacaoAtual.categoryId.toString(),
    isExpense: transacaoAtual.isExpense,
    paymentMethod: transacaoAtual.paymentMethod || "",
    notes: transacaoAtual.notes || "",
    tags: transacaoAtual.tags || [],
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
          <h1 className="text-3xl font-bold">Editar Transação</h1>
          <p className="text-muted-foreground">
            Atualize os dados da transação
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
            onSubmit={handleAtualizarTransacao}
            isLoading={isLoading}
            error={error}
            dadosIniciais={dadosIniciais}
          />
        </CardContent>
      </Card>
    </div>
  );
}
