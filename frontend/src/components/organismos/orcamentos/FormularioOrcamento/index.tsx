// src/components/organismos/orcamentos/FormularioOrcamento/index.tsx
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { formatarDataParaAPI, converterISOParaData } from "@/utils/data";
import {
  Orcamento,
  OrcamentoCriar,
  OrcamentoAtualizar,
  TipoRecorrencia,
} from "@/types/orcamento";
import { Categoria } from "@/types/categoria";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampoFormulario } from "@/components/moleculas/formularios/CampoFormulario";
import { SeletorCategoriasMultiplas } from "@/components/moleculas/orcamentos/SeletorCategoriasMultiplas";

interface FormularioOrcamentoProps {
  orcamento?: Orcamento;
  categorias: Categoria[];
  onSubmit: (dados: OrcamentoCriar | OrcamentoAtualizar) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  modo: "criar" | "editar";
}

export function FormularioOrcamento({
  orcamento,
  categorias,
  onSubmit,
  isLoading,
  error,
  clearError,
  modo,
}: FormularioOrcamentoProps) {
  // Form state
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [recorrencia, setRecorrencia] = useState<TipoRecorrencia>(
    TipoRecorrencia.MONTHLY
  );
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);

  // Validation errors
  const [nomeError, setNomeError] = useState("");
  const [valorError, setValorError] = useState("");
  const [dataInicioError, setDataInicioError] = useState("");
  const [dataFimError, setDataFimError] = useState("");
  const [categoriasError, setCategoriasError] = useState("");

  // Load budget data if in edit mode
  useEffect(() => {
    if (orcamento && modo === "editar") {
      setNome(orcamento.name);
      setValor(String(orcamento.amount));

      // Format dates for input[type="date"]
      const dateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      } as const;
      const startDate = new Date(orcamento.startDate);
      const endDate = new Date(orcamento.endDate);

      setDataInicio(startDate.toISOString().split("T")[0]);
      setDataFim(endDate.toISOString().split("T")[0]);

      setRecorrencia(orcamento.recurrence || TipoRecorrencia.MONTHLY);

      // Set selected categories
      if (orcamento.categories) {
        setCategoriasSelecionadas(orcamento.categories.map((cat) => cat.id));
      }
    }
  }, [orcamento, modo]);

  // Clear validation errors when fields change
  useEffect(() => {
    if (nome) setNomeError("");
    if (valor) setValorError("");
    if (dataInicio) setDataInicioError("");
    if (dataFim) setDataFimError("");
    if (categoriasSelecionadas.length > 0) setCategoriasError("");
    if (
      nome ||
      valor ||
      dataInicio ||
      dataFim ||
      categoriasSelecionadas.length > 0
    ) {
      clearError();
    }
  }, [nome, valor, dataInicio, dataFim, categoriasSelecionadas, clearError]);

  // Validate form before submission
  const validarFormulario = () => {
    let isValid = true;

    // Reset all validation errors
    setNomeError("");
    setValorError("");
    setDataInicioError("");
    setDataFimError("");
    setCategoriasError("");

    // Validate name
    if (!nome) {
      setNomeError("O nome do orçamento é obrigatório");
      isValid = false;
    }

    // Validate amount
    if (!valor) {
      setValorError("O valor do orçamento é obrigatório");
      isValid = false;
    } else if (isNaN(Number(valor)) || Number(valor) <= 0) {
      setValorError("O valor deve ser um número maior que zero");
      isValid = false;
    }

    // Validate start date
    if (!dataInicio) {
      setDataInicioError("A data de início é obrigatória");
      isValid = false;
    }

    // Validate end date
    if (!dataFim) {
      setDataFimError("A data de término é obrigatória");
      isValid = false;
    } else if (
      dataInicio &&
      dataFim &&
      new Date(dataFim) < new Date(dataInicio)
    ) {
      setDataFimError("A data de término deve ser posterior à data de início");
      isValid = false;
    }

    // Validate categories
    if (categoriasSelecionadas.length === 0) {
      setCategoriasError("Selecione pelo menos uma categoria");
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validarFormulario()) {
      return;
    }

    const dadosOrcamento: OrcamentoCriar | OrcamentoAtualizar = {
      name: nome,
      amount: Number(valor),
      startDate: dataInicio,
      endDate: dataFim,
      recurrence: recorrencia,
      categoryIds: categoriasSelecionadas,
    };

    await onSubmit(dadosOrcamento);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {modo === "criar" ? "Novo Orçamento" : "Editar Orçamento"}
        </CardTitle>
        <CardDescription>
          {modo === "criar"
            ? "Crie um novo orçamento para controlar seus gastos"
            : "Atualize as informações do orçamento"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <CampoFormulario
            id="nome"
            label="Nome do Orçamento"
            error={nomeError}
          >
            <Input
              id="nome"
              placeholder="Ex: Gastos com Alimentação"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </CampoFormulario>

          <CampoFormulario
            id="valor"
            label="Valor do Orçamento"
            error={valorError}
          >
            <Input
              id="valor"
              placeholder="Ex: 1000.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              disabled={isLoading}
              type="number"
              step="0.01"
              min="0"
            />
          </CampoFormulario>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CampoFormulario
              id="dataInicio"
              label="Data de Início"
              error={dataInicioError}
            >
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                disabled={isLoading}
              />
            </CampoFormulario>

            <CampoFormulario
              id="dataFim"
              label="Data de Término"
              error={dataFimError}
            >
              <Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={isLoading}
              />
            </CampoFormulario>
          </div>

          <CampoFormulario id="recorrencia" label="Recorrência">
            <Select
              value={recorrencia}
              onValueChange={(value) =>
                setRecorrencia(value as TipoRecorrencia)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a recorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TipoRecorrencia.NONE}>Uma vez</SelectItem>
                <SelectItem value={TipoRecorrencia.DAILY}>Diário</SelectItem>
                <SelectItem value={TipoRecorrencia.WEEKLY}>Semanal</SelectItem>
                <SelectItem value={TipoRecorrencia.BIWEEKLY}>
                  Quinzenal
                </SelectItem>
                <SelectItem value={TipoRecorrencia.MONTHLY}>Mensal</SelectItem>
                <SelectItem value={TipoRecorrencia.QUARTERLY}>
                  Trimestral
                </SelectItem>
                <SelectItem value={TipoRecorrencia.SEMIANNUALLY}>
                  Semestral
                </SelectItem>
                <SelectItem value={TipoRecorrencia.ANNUALLY}>Anual</SelectItem>
              </SelectContent>
            </Select>
          </CampoFormulario>

          <CampoFormulario
            id="categorias"
            label="Categorias"
            error={categoriasError}
          >
            <SeletorCategoriasMultiplas
              categorias={categorias.filter((cat) => cat.isExpense)}
              selecionadas={categoriasSelecionadas}
              onChange={setCategoriasSelecionadas}
              disabled={isLoading}
            />
          </CampoFormulario>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {modo === "criar" ? "Criando..." : "Salvando..."}
                </>
              ) : (
                <>
                  {modo === "criar" ? "Criar Orçamento" : "Salvar Alterações"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
