// src/app/budgets/[id]/edit/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useOrcamentos, useCategorias } from "@/hooks";
import { ROTAS } from "@/constants/rotas";
import { OrcamentoAtualizar } from "@/types/orcamento";

// Components
import { FormularioOrcamento } from "@/components/organismos/orcamentos/FormularioOrcamento";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const {
    orcamentoAtual,
    buscarOrcamentoPorId,
    atualizarOrcamento,
    isLoading: isLoadingOrcamento,
    error: errorOrcamento,
    limparErro: limparErroOrcamento,
  } = useOrcamentos();

  const {
    categorias,
    isLoading: isLoadingCategorias,
    error: errorCategorias,
    buscarCategorias,
  } = useCategorias();

  // Fetch budget and categories data on page load
  useEffect(() => {
    if (id) {
      buscarOrcamentoPorId(id);
      buscarCategorias();
    }
  }, [id, buscarOrcamentoPorId, buscarCategorias]);

  // Handle budget update
  const handleUpdateBudget = async (dados: OrcamentoAtualizar) => {
    if (!id) {
      return;
    }

    const orcamentoAtualizado = await atualizarOrcamento(id, dados);

    if (orcamentoAtualizado) {
      router.push(ROTAS.PRIVATE.ORCAMENTOS.LISTAR);
    }
  };

  // Handle invalid budget ID
  if (!id) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertDescription>ID do orçamento inválido</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <FormularioOrcamento
        orcamento={orcamentoAtual}
        categorias={categorias}
        onSubmit={handleUpdateBudget}
        isLoading={isLoadingOrcamento || isLoadingCategorias}
        error={errorOrcamento || errorCategorias}
        clearError={limparErroOrcamento}
        modo="editar"
      />
    </div>
  );
}
