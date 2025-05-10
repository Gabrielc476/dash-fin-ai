// frontend/src/app/(private)/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransacoes, useCategorias } from "@/hooks";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";

// Componentes
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabelaTransacoes } from "@/components/organismos/transacoes/TabelaTransacoes";
import { FiltrosTransacao } from "@/components/organismos/transacoes/FiltrosTransacao";

// Icons
import { Plus, Loader2 } from "lucide-react";

export default function TransacoesPage() {
  const router = useRouter();
  const {
    transacoes,
    isLoading,
    error,
    buscarTransacoes,
    removerTransacao,
    filtros,
    atualizarFiltros,
  } = useTransacoes();
  const { categorias, buscarCategorias } = useCategorias();

  // Estado local para filtros
  const [filtrosLocais, setFiltrosLocais] = useState({
    dataInicial: obterPeriodo("mes").inicio,
    dataFinal: obterPeriodo("mes").fim,
    categoriaSelecionada: null,
    tipoTransacao: "todos", // todos, receitas, despesas
  });

  // Carregar dados ao montar
  useEffect(() => {
    buscarCategorias();
    carregarTransacoes();
  }, []);

  const carregarTransacoes = async () => {
    const params = {
      dataInicial: formatarDataParaAPI(filtrosLocais.dataInicial),
      dataFinal: formatarDataParaAPI(filtrosLocais.dataFinal),
    };

    await buscarTransacoes(params);
  };

  const handleAplicarFiltros = () => {
    atualizarFiltros({
      dataInicial: formatarDataParaAPI(filtrosLocais.dataInicial),
      dataFinal: formatarDataParaAPI(filtrosLocais.dataFinal),
    });
  };

  const handleEditarTransacao = (id: number) => {
    router.push(ROTAS.PRIVATE.TRANSACOES.EDITAR(id));
  };

  const handleDetalharTransacao = (id: number) => {
    router.push(ROTAS.PRIVATE.TRANSACOES.DETALHE(id));
  };

  const handleExcluirTransacao = async (id: number) => {
    const sucesso = await removerTransacao(id);
    if (sucesso) {
      // Recarregar lista
      carregarTransacoes();
    }
  };

  // Filtrar transações localmente com base nos filtros
  const transacoesFiltradas = transacoes.filter((transacao) => {
    // Filtro por categoria
    if (
      filtrosLocais.categoriaSelecionada &&
      transacao.categoryId !== filtrosLocais.categoriaSelecionada
    ) {
      return false;
    }

    // Filtro por tipo
    if (filtrosLocais.tipoTransacao === "receitas" && transacao.isExpense) {
      return false;
    }
    if (filtrosLocais.tipoTransacao === "despesas" && !transacao.isExpense) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.ADICIONAR)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Filtros */}
      <FiltrosTransacao
        filtros={filtrosLocais}
        onFiltrosChange={setFiltrosLocais}
        onAplicarFiltros={handleAplicarFiltros}
        categorias={categorias}
      />

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando transações...
              </div>
            ) : (
              `${transacoesFiltradas.length} transaç${
                transacoesFiltradas.length !== 1 ? "ões" : "ão"
              }`
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaTransacoes
            transacoes={transacoesFiltradas}
            isLoading={isLoading}
            error={error}
            onEditar={handleEditarTransacao}
            onDetalhar={handleDetalharTransacao}
            onExcluir={handleExcluirTransacao}
          />
        </CardContent>
      </Card>
    </div>
  );
}
