// src/app/budgets/add/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOrcamentos, useCategorias } from "@/hooks";
import { ROTAS } from "@/constants/rotas";
import { OrcamentoCriar, OrcamentoAtualizar } from "@/types/orcamento";

// Components
import { FormularioOrcamento } from "@/components/organismos/orcamentos/FormularioOrcamento";

export default function AddBudgetPage() {
  const router = useRouter();
  const {
    criarOrcamento,
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

  // Fetch categories on page load
  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

  // Handle budget creation - now accepts both types
  const handleCreateBudget = async (
    dados: OrcamentoCriar | OrcamentoAtualizar
  ) => {
    // Since we're in create mode, we can assert that all required fields are present
    // Convert OrcamentoAtualizar to OrcamentoCriar by providing default values for required fields
    const dadosCompletos: OrcamentoCriar = {
      name: dados.name || "",
      amount: dados.amount || 0,
      startDate: dados.startDate || "",
      endDate: dados.endDate || "",
      recurrence: dados.recurrence,
      categoryIds: dados.categoryIds || [],
    };

    const novoOrcamento = await criarOrcamento(dadosCompletos);

    if (novoOrcamento) {
      router.push(ROTAS.PRIVATE.ORCAMENTOS.LISTAR);
    }
  };

  return (
    <div className="container py-6">
      <FormularioOrcamento
        categorias={categorias}
        onSubmit={handleCreateBudget}
        isLoading={isLoadingOrcamento || isLoadingCategorias}
        error={errorOrcamento || errorCategorias}
        clearError={limparErroOrcamento}
        modo="criar"
      />
    </div>
  );
}
