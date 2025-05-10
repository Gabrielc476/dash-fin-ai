// frontend/src/components/organismos/transacoes/TabelaTransacoes/index.tsx
"use client";

import { Transacao } from "@/types/transacao";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CabecalhoTabela } from "./CabecalhoTabela";
import { LinhaTransacao } from "./LinhaTransacao";
import { BarraAcoes } from "./BarraAcoes";
import { useState } from "react";

interface TabelaTransacoesProps {
  transacoes: Transacao[];
  isLoading: boolean;
  error: string | null;
  onEditar: (id: number) => void;
  onDetalhar: (id: number) => void;
  onExcluir: (id: number) => void;
}

export function TabelaTransacoes({
  transacoes,
  isLoading,
  error,
  onEditar,
  onDetalhar,
  onExcluir,
}: TabelaTransacoesProps) {
  const [ordenacao, setOrdenacao] = useState({
    campo: "date" as keyof Transacao,
    direcao: "desc" as "asc" | "desc",
  });
  const [transacoesSelecionadas, setTransacoesSelecionadas] = useState<
    number[]
  >([]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (transacoes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma transação encontrada.</p>
      </div>
    );
  }

  // Ordenar transações
  const transacoesOrdenadas = [...transacoes].sort((a, b) => {
    const aVal = a[ordenacao.campo];
    const bVal = b[ordenacao.campo];

    if (aVal < bVal) return ordenacao.direcao === "asc" ? -1 : 1;
    if (aVal > bVal) return ordenacao.direcao === "asc" ? 1 : -1;
    return 0;
  });

  const handleOrdenar = (campo: keyof Transacao) => {
    if (ordenacao.campo === campo) {
      setOrdenacao((prev) => ({
        ...prev,
        direcao: prev.direcao === "asc" ? "desc" : "asc",
      }));
    } else {
      setOrdenacao({ campo, direcao: "asc" });
    }
  };

  const handleSelecionarTransacao = (id: number) => {
    setTransacoesSelecionadas((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelecionarTodas = () => {
    if (transacoesSelecionadas.length === transacoes.length) {
      setTransacoesSelecionadas([]);
    } else {
      setTransacoesSelecionadas(transacoes.map((t) => t.id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de ações */}
      {transacoesSelecionadas.length > 0 && (
        <BarraAcoes
          quantidadeSelecionada={transacoesSelecionadas.length}
          onExcluirSelecionadas={() => {
            transacoesSelecionadas.forEach((id) => onExcluir(id));
            setTransacoesSelecionadas([]);
          }}
          onDesselecionar={() => setTransacoesSelecionadas([])}
        />
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <CabecalhoTabela
            ordenacao={ordenacao}
            onOrdenar={handleOrdenar}
            todosSelecionados={
              transacoesSelecionadas.length === transacoes.length
            }
            onSelecionarTodos={handleSelecionarTodas}
          />
          <tbody>
            {transacoesOrdenadas.map((transacao) => (
              <LinhaTransacao
                key={transacao.id}
                transacao={transacao}
                isSelected={transacoesSelecionadas.includes(transacao.id)}
                onSelecionar={() => handleSelecionarTransacao(transacao.id)}
                onEditar={onEditar}
                onDetalhar={onDetalhar}
                onExcluir={onExcluir}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
