// src/app/budgets/[id]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useOrcamentos } from "@/hooks";

// Components
import { ProgressoOrcamento } from "@/components/organismos/orcamentos/ProgressoOrcamento";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const {
    progressoAtual,
    buscarProgressoOrcamento,
    isLoading,
    error,
    limparErro,
  } = useOrcamentos();

  // Fetch budget progress on page load
  useEffect(() => {
    if (id) {
      buscarProgressoOrcamento(id);
    }
  }, [id, buscarProgressoOrcamento]);

  // Handle refresh button click
  const handleRefresh = async () => {
    if (id) {
      await buscarProgressoOrcamento(id);
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
      <ProgressoOrcamento
        progresso={progressoAtual}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
