// frontend/src/components/organismos/relatorios/FiltrosRelatorio/index.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SeletorPeriodo, PeriodoOption } from "../SeletorPeriodo";
import { Categoria } from "@/types/categoria";
import { Filter, RefreshCw, Tag, ChevronDown, AlertCircle } from "lucide-react";
import { TipoAgrupamento } from "@/types/relatorio";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FiltrosRelatorioProps {
  categorias: Categoria[];
  isLoadingCategorias?: boolean;
  tiposAgrupamento?: TipoAgrupamento[];
  exibirTipoAgrupamento?: boolean;
  exibirTiposTransacao?: boolean;
  exibirCategorias?: boolean;
  onAplicarFiltros: (filtros: FiltrosRelatorioValues) => void;
  valorInicial?: Partial<FiltrosRelatorioValues>;
  className?: string;
}

export interface FiltrosRelatorioValues {
  periodo: PeriodoOption;
  dataInicial: Date;
  dataFinal: Date;
  agrupamento?: TipoAgrupamento;
  incluirReceitas: boolean;
  incluirDespesas: boolean;
  categoriasIds: number[];
}

export function FiltrosRelatorio({
  categorias,
  isLoadingCategorias = false,
  tiposAgrupamento = [
    TipoAgrupamento.DAY,
    TipoAgrupamento.WEEK,
    TipoAgrupamento.MONTH,
    TipoAgrupamento.QUARTER,
    TipoAgrupamento.YEAR,
  ],
  exibirTipoAgrupamento = true,
  exibirTiposTransacao = true,
  exibirCategorias = true,
  onAplicarFiltros,
  valorInicial,
  className = "",
}: FiltrosRelatorioProps) {
  // Estado para filtros
  const [filtros, setFiltros] = useState<FiltrosRelatorioValues>({
    periodo: "mes",
    dataInicial: new Date(),
    dataFinal: new Date(),
    agrupamento: TipoAgrupamento.MONTH,
    incluirReceitas: true,
    incluirDespesas: true,
    categoriasIds: [],
    ...valorInicial,
  });

  // Atualizar dados do seletor de período
  const handlePeriodoChange = (
    periodo: PeriodoOption,
    dataInicial: Date,
    dataFinal: Date
  ) => {
    setFiltros((prev) => ({
      ...prev,
      periodo,
      dataInicial,
      dataFinal,
    }));
  };

  // Alternar categoria
  const handleToggleCategoria = (categoriaId: number) => {
    setFiltros((prev) => {
      const categoriasSelecionadas = [...prev.categoriasIds];
      const index = categoriasSelecionadas.indexOf(categoriaId);

      if (index === -1) {
        categoriasSelecionadas.push(categoriaId);
      } else {
        categoriasSelecionadas.splice(index, 1);
      }

      return {
        ...prev,
        categoriasIds: categoriasSelecionadas,
      };
    });
  };

  // Selecionar todas as categorias
  const handleSelecionarTodasCategorias = () => {
    const todasCategoriasIds = categorias.map((cat) => cat.id);
    setFiltros((prev) => ({
      ...prev,
      categoriasIds: todasCategoriasIds,
    }));
  };

  // Limpar seleção de categorias
  const handleLimparCategorias = () => {
    setFiltros((prev) => ({
      ...prev,
      categoriasIds: [],
    }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </CardTitle>
        <CardDescription>Defina os filtros para o relatório</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          defaultValue="periodo"
          className="w-full"
        >
          {/* Período */}
          <AccordionItem value="periodo">
            <AccordionTrigger>Período</AccordionTrigger>
            <AccordionContent>
              <SeletorPeriodo
                periodo={filtros.periodo}
                dataInicial={filtros.dataInicial}
                dataFinal={filtros.dataFinal}
                onChange={handlePeriodoChange}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Agrupamento */}
          {exibirTipoAgrupamento && (
            <AccordionItem value="agrupamento">
              <AccordionTrigger>Agrupamento</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agrupar por</label>
                  <Select
                    value={filtros.agrupamento}
                    onValueChange={(valor) =>
                      setFiltros({
                        ...filtros,
                        agrupamento: valor as TipoAgrupamento,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o agrupamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAgrupamento.includes(TipoAgrupamento.DAY) && (
                        <SelectItem value={TipoAgrupamento.DAY}>Dia</SelectItem>
                      )}
                      {tiposAgrupamento.includes(TipoAgrupamento.WEEK) && (
                        <SelectItem value={TipoAgrupamento.WEEK}>
                          Semana
                        </SelectItem>
                      )}
                      {tiposAgrupamento.includes(TipoAgrupamento.MONTH) && (
                        <SelectItem value={TipoAgrupamento.MONTH}>
                          Mês
                        </SelectItem>
                      )}
                      {tiposAgrupamento.includes(TipoAgrupamento.QUARTER) && (
                        <SelectItem value={TipoAgrupamento.QUARTER}>
                          Trimestre
                        </SelectItem>
                      )}
                      {tiposAgrupamento.includes(TipoAgrupamento.YEAR) && (
                        <SelectItem value={TipoAgrupamento.YEAR}>
                          Ano
                        </SelectItem>
                      )}
                      {tiposAgrupamento.includes(TipoAgrupamento.CATEGORY) && (
                        <SelectItem value={TipoAgrupamento.CATEGORY}>
                          Categoria
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Tipos de Transação */}
          {exibirTiposTransacao && (
            <AccordionItem value="tiposTransacao">
              <AccordionTrigger>Tipos de Transação</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="incluirReceitas"
                      checked={filtros.incluirReceitas}
                      onCheckedChange={(checked) =>
                        setFiltros({
                          ...filtros,
                          incluirReceitas: !!checked,
                        })
                      }
                    />
                    <Label
                      htmlFor="incluirReceitas"
                      className="text-sm cursor-pointer"
                    >
                      Incluir receitas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="incluirDespesas"
                      checked={filtros.incluirDespesas}
                      onCheckedChange={(checked) =>
                        setFiltros({
                          ...filtros,
                          incluirDespesas: !!checked,
                        })
                      }
                    />
                    <Label
                      htmlFor="incluirDespesas"
                      className="text-sm cursor-pointer"
                    >
                      Incluir despesas
                    </Label>
                  </div>
                </div>

                {!filtros.incluirReceitas && !filtros.incluirDespesas && (
                  <Alert className="mt-2" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Selecione pelo menos um tipo de transação.
                    </AlertDescription>
                  </Alert>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Categorias */}
          {exibirCategorias && (
            <AccordionItem value="categorias">
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <span>Categorias</span>
                  {filtros.categoriasIds.length > 0 && (
                    <span className="text-xs text-muted-foreground mr-2">
                      {filtros.categoriasIds.length} selecionadas
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Filtrar por categorias
                    </label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelecionarTodasCategorias}
                      >
                        Todas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLimparCategorias}
                      >
                        Nenhuma
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                    {isLoadingCategorias ? (
                      <div className="flex items-center justify-center p-2">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm">
                          Carregando categorias...
                        </span>
                      </div>
                    ) : categorias.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {categorias.map((categoria) => (
                          <div
                            key={categoria.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`categoria-${categoria.id}`}
                              checked={filtros.categoriasIds.includes(
                                categoria.id
                              )}
                              onCheckedChange={() =>
                                handleToggleCategoria(categoria.id)
                              }
                            />
                            <Label
                              htmlFor={`categoria-${categoria.id}`}
                              className="flex items-center cursor-pointer text-sm"
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: categoria.color }}
                              />
                              {categoria.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-2">
                        <Tag className="w-4 h-4 mx-auto mb-1 opacity-40" />
                        <p className="text-xs text-muted-foreground">
                          Nenhuma categoria disponível
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => onAplicarFiltros(filtros)}
          disabled={!filtros.incluirReceitas && !filtros.incluirDespesas}
        >
          Aplicar Filtros
        </Button>
      </CardFooter>
    </Card>
  );
}
