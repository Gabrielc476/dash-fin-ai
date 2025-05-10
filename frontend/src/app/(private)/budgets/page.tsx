// src/app/budgets/page.tsx
"use client";

import { useEffect } from "react";
import { useOrcamentos } from "@/hooks";
import { ListaOrcamentos } from "@/components/organismos/orcamentos/ListaOrcamentos";

export default function BudgetsPage() {
  const {
    orcamentos,
    isLoading,
    error,
    buscarOrcamentos,
    removerOrcamento,
    limparErro,
  } = useOrcamentos();

  // Fetch budgets on page load
  useEffect(() => {
    buscarOrcamentos();
  }, [buscarOrcamentos]);

  // Handle budget deletion
  const handleDeleteBudget = async (id: number) => {
    return removerOrcamento(id);
  };

  return (
    <div className="container py-6">
      <ListaOrcamentos
        orcamentos={orcamentos}
        onDelete={handleDeleteBudget}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
