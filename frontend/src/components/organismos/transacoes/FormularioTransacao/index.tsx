// frontend/src/components/organismos/transacoes/FormularioTransacao/index.tsx
"use client";

import { useState, useEffect } from "react";
import { useCategorias } from "@/hooks";
import { CamposBasicos } from "./CamposBasicos";
import { SeletorCategoria } from "./SeletorCategoria";
import { CamposOpcionais } from "./CamposOpcionais";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface FormularioTransacaoProps {
  onSubmit: (dados: any) => void;
  isLoading: boolean;
  error: string | null;
  dadosIniciais?: any;
}

export function FormularioTransacao({
  onSubmit,
  isLoading,
  error,
  dadosIniciais,
}: FormularioTransacaoProps) {
  const { categorias, buscarCategorias } = useCategorias();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    isExpense: true,
    paymentMethod: "",
    notes: "",
    tags: [],
    ...dadosIniciais,
  });

  useEffect(() => {
    buscarCategorias();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      ...formData,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId),
      date: new Date(formData.date).toISOString(),
    };

    onSubmit(dados);
  };

  const categoriasFiltradas = categorias.filter(
    (cat) => cat.isExpense === formData.isExpense
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CamposBasicos formData={formData} onChange={setFormData} />

      <SeletorCategoria
        categorias={categoriasFiltradas}
        categoriaSelecionada={formData.categoryId}
        isExpense={formData.isExpense}
        onCategoriaChange={(categoryId) =>
          setFormData({ ...formData, categoryId })
        }
        onTipoChange={(isExpense) =>
          setFormData({ ...formData, isExpense, categoryId: "" })
        }
      />

      <CamposOpcionais formData={formData} onChange={setFormData} />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Transação"
          )}
        </Button>
      </div>
    </form>
  );
}
