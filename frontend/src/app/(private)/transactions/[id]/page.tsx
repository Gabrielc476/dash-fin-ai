// frontend/src/app/(private)/transactions/[id]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useTransacoes, useCategorias } from "@/hooks";
import { ROTAS } from "@/constants/rotas";
import { formatarMoeda, formatarData } from "@/utils/formatadores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  FileText,
} from "lucide-react";

export default function DetalheTransacaoPage() {
  const router = useRouter();
  const params = useParams();
  const {
    transacaoAtual,
    buscarTransacaoPorId,
    removerTransacao,
    isLoading,
    error,
  } = useTransacoes();

  useEffect(() => {
    if (params.id) {
      buscarTransacaoPorId(params.id as string);
    }
  }, [params.id]);

  const handleExcluir = async () => {
    const confirmacao = confirm(
      "Tem certeza que deseja excluir esta transação?"
    );
    if (confirmacao) {
      const sucesso = await removerTransacao(params.id as string);
      if (sucesso) {
        router.push(ROTAS.PRIVATE.TRANSACOES.LISTAR);
      }
    }
  };

  if (isLoading && !transacaoAtual) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transacaoAtual) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Transação não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold">Detalhes da Transação</h1>
            <p className="text-muted-foreground">
              {transacaoAtual.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(ROTAS.PRIVATE.TRANSACOES.EDITAR(transacaoAtual.id))
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleExcluir}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Detalhes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informações</CardTitle>
            <Badge
              variant={transacaoAtual.isExpense ? "destructive" : "secondary"}
              className="text-lg px-3 py-1"
            >
              {transacaoAtual.isExpense ? "-" : "+"}
              {formatarMoeda(transacaoAtual.amount)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">
                  {formatarData(new Date(transacaoAtual.date), "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Categoria</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: transacaoAtual.category?.color || "#666",
                    }}
                  />
                  <p className="font-medium">
                    {transacaoAtual.category?.name || "Sem categoria"}
                  </p>
                </div>
              </div>
            </div>

            {/* Método de Pagamento */}
            {transacaoAtual.paymentMethod && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Método de Pagamento
                  </p>
                  <p className="font-medium">{transacaoAtual.paymentMethod}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {transacaoAtual.tags && transacaoAtual.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {transacaoAtual.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notas */}
          {transacaoAtual.notes && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Notas</p>
                  <p className="mt-1 text-sm">{transacaoAtual.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metadados */}
          <div className="mt-6 pt-6 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>
                Criado em:{" "}
                {formatarData(
                  new Date(transacaoAtual.createdAt),
                  "dd/MM/yyyy HH:mm"
                )}
              </span>
              <span>
                Atualizado em:{" "}
                {formatarData(
                  new Date(transacaoAtual.updatedAt),
                  "dd/MM/yyyy HH:mm"
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
