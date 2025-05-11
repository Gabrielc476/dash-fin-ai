// frontend/src/app/(private)/reports/export/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useRelatorios, useCategorias } from "@/hooks";
import { FormatoExportacao } from "@/types/relatorio";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Icons
import {
  ArrowLeft,
  Calendar,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  AlertCircle,
  FileCsv,
  FileDown,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function ExportarRelatorioPage() {
  const router = useRouter();
  const { exportarDados, isLoading, error, limparErro } = useRelatorios();
  const {
    categorias,
    buscarCategorias,
    isLoading: isLoadingCategorias,
  } = useCategorias();

  // Estado para configuração de exportação
  const [configuracao, setConfiguracao] = useState({
    tipoRelatorio: "transacoes", // transacoes, categorias, orcamentos
    formato: FormatoExportacao.CSV,
    periodo: "mes" as
      | "hoje"
      | "semana"
      | "mes"
      | "trimestre"
      | "ano"
      | "custom",
    dataInicial: new Date(),
    dataFinal: new Date(),
    incluirReceitas: true,
    incluirDespesas: true,
    categoriasIds: [] as number[],
    exportacaoConcluida: false,
  });

  // Atualizar datas quando o período muda
  useEffect(() => {
    if (configuracao.periodo !== "custom") {
      const periodo = obterPeriodo(configuracao.periodo);
      setConfiguracao((prev) => ({
        ...prev,
        dataInicial: periodo.inicio,
        dataFinal: periodo.fim,
      }));
    }
  }, [configuracao.periodo]);

  // Carregar categorias
  useEffect(() => {
    buscarCategorias();
  }, []);

  const handleExportar = async () => {
    setConfiguracao((prev) => ({ ...prev, exportacaoConcluida: false }));

    try {
      // Exportar dados
      await exportarDados(
        configuracao.dataInicial,
        configuracao.dataFinal,
        configuracao.formato
      );

      // Marcar exportação como concluída
      setConfiguracao((prev) => ({ ...prev, exportacaoConcluida: true }));

      // Limpar sinalização após 3 segundos
      setTimeout(() => {
        setConfiguracao((prev) => ({ ...prev, exportacaoConcluida: false }));
      }, 3000);
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  const handleToggleCategoria = (categoriaId: number) => {
    setConfiguracao((prev) => {
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

  // Ícone do formato de exportação
  const IconeFormato = () => {
    switch (configuracao.formato) {
      case FormatoExportacao.CSV:
        return <FileCsv className="w-8 h-8 text-green-600" />;
      case FormatoExportacao.EXCEL:
        return <FileSpreadsheet className="w-8 h-8 text-blue-600" />;
      case FormatoExportacao.JSON:
        return <FileJson className="w-8 h-8 text-orange-600" />;
      case FormatoExportacao.PDF:
        return <FileText className="w-8 h-8 text-red-600" />;
      default:
        return <FileDown className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROTAS.PRIVATE.RELATORIOS.INICIO)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Exportar Dados</h1>
            <p className="text-muted-foreground">
              Exporte seus dados financeiros em diferentes formatos
            </p>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações de Exportação */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Configurações
              </CardTitle>
              <CardDescription>
                Defina os parâmetros para exportação dos dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipo de Relatório */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <RadioGroup
                  value={configuracao.tipoRelatorio}
                  onValueChange={(value) =>
                    setConfiguracao({ ...configuracao, tipoRelatorio: value })
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transacoes" id="r1" />
                    <Label htmlFor="r1">Transações</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="categorias" id="r2" />
                    <Label htmlFor="r2">Gastos por Categoria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orcamentos" id="r3" />
                    <Label htmlFor="r3">Orçamentos</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Formato */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Formato</label>
                <RadioGroup
                  value={configuracao.formato}
                  onValueChange={(value) =>
                    setConfiguracao({
                      ...configuracao,
                      formato: value as FormatoExportacao,
                    })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value={FormatoExportacao.CSV} id="f1" />
                    <div className="flex items-center space-x-2">
                      <FileCsv className="w-5 h-5 text-green-600" />
                      <Label htmlFor="f1">CSV</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value={FormatoExportacao.EXCEL} id="f2" />
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                      <Label htmlFor="f2">Excel</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value={FormatoExportacao.JSON} id="f3" />
                    <div className="flex items-center space-x-2">
                      <FileJson className="w-5 h-5 text-orange-600" />
                      <Label htmlFor="f3">JSON</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value={FormatoExportacao.PDF} id="f4" />
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-red-600" />
                      <Label htmlFor="f4">PDF</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Período */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Período</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={configuracao.periodo}
                    onValueChange={(valor) =>
                      setConfiguracao({
                        ...configuracao,
                        periodo: valor as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="semana">Esta Semana</SelectItem>
                      <SelectItem value="mes">Este Mês</SelectItem>
                      <SelectItem value="trimestre">Este Trimestre</SelectItem>
                      <SelectItem value="ano">Este Ano</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>

                  {configuracao.periodo === "custom" && (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="date"
                          className="w-full h-10 px-3 py-2 border rounded-md"
                          value={format(configuracao.dataInicial, "yyyy-MM-dd")}
                          onChange={(e) =>
                            setConfiguracao({
                              ...configuracao,
                              dataInicial: new Date(e.target.value),
                            })
                          }
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <span className="text-muted-foreground">até</span>
                      <div className="relative flex-1">
                        <input
                          type="date"
                          className="w-full h-10 px-3 py-2 border rounded-md"
                          value={format(configuracao.dataFinal, "yyyy-MM-dd")}
                          onChange={(e) =>
                            setConfiguracao({
                              ...configuracao,
                              dataFinal: new Date(e.target.value),
                            })
                          }
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Opções adicionais */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Opções adicionais</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="incluirReceitas"
                      checked={configuracao.incluirReceitas}
                      onCheckedChange={(checked) =>
                        setConfiguracao({
                          ...configuracao,
                          incluirReceitas: !!checked,
                        })
                      }
                    />
                    <label
                      htmlFor="incluirReceitas"
                      className="text-sm cursor-pointer"
                    >
                      Incluir receitas
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="incluirDespesas"
                      checked={configuracao.incluirDespesas}
                      onCheckedChange={(checked) =>
                        setConfiguracao({
                          ...configuracao,
                          incluirDespesas: !!checked,
                        })
                      }
                    />
                    <label
                      htmlFor="incluirDespesas"
                      className="text-sm cursor-pointer"
                    >
                      Incluir despesas
                    </label>
                  </div>
                </div>
              </div>

              {/* Filtro de categorias */}
              {(configuracao.tipoRelatorio === "transacoes" ||
                configuracao.tipoRelatorio === "categorias") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Filtrar por categorias
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {configuracao.categoriasIds.length > 0
                        ? `${configuracao.categoriasIds.length} selecionadas`
                        : "Todas"}
                    </span>
                  </div>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                    {isLoadingCategorias ? (
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
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
                              checked={configuracao.categoriasIds.includes(
                                categoria.id
                              )}
                              onCheckedChange={() =>
                                handleToggleCategoria(categoria.id)
                              }
                            />
                            <label
                              htmlFor={`categoria-${categoria.id}`}
                              className="flex items-center cursor-pointer text-sm"
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: categoria.color }}
                              />
                              {categoria.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-2">
                        Nenhuma categoria disponível
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleExportar}
                disabled={isLoading || configuracao.exportacaoConcluida}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : configuracao.exportacaoConcluida ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Concluído!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-4">
                <IconeFormato />
                <span className="mt-2 font-medium">
                  {(() => {
                    switch (configuracao.formato) {
                      case FormatoExportacao.CSV:
                        return "Arquivo CSV";
                      case FormatoExportacao.EXCEL:
                        return "Planilha Excel";
                      case FormatoExportacao.JSON:
                        return "Arquivo JSON";
                      case FormatoExportacao.PDF:
                        return "Documento PDF";
                      default:
                        return "Arquivo";
                    }
                  })()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">
                    Tipo de Relatório
                  </span>
                  <span className="font-medium">
                    {(() => {
                      switch (configuracao.tipoRelatorio) {
                        case "transacoes":
                          return "Transações";
                        case "categorias":
                          return "Gastos por Categoria";
                        case "orcamentos":
                          return "Orçamentos";
                        default:
                          return configuracao.tipoRelatorio;
                      }
                    })()}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Período</span>
                  <span className="font-medium">
                    {format(configuracao.dataInicial, "dd/MM/yyyy", {
                      locale: ptBR,
                    })}{" "}
                    até{" "}
                    {format(configuracao.dataFinal, "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Filtros</span>
                  <div className="flex items-center gap-1 font-medium">
                    {configuracao.incluirReceitas && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Receitas
                      </span>
                    )}
                    {configuracao.incluirDespesas && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Despesas
                      </span>
                    )}
                  </div>
                </div>

                {configuracao.categoriasIds.length > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Categorias</span>
                    <span className="font-medium">
                      {configuracao.categoriasIds.length} selecionadas
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleExportar}
                disabled={isLoading || configuracao.exportacaoConcluida}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Arquivo
              </Button>
            </CardFooter>
          </Card>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dicas para Exportação</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <FileSpreadsheet className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>
                    Use o formato <strong>Excel</strong> para análises mais
                    avançadas com fórmulas e gráficos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FileCsv className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    O formato <strong>CSV</strong> é ideal para importar em
                    outros softwares financeiros.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 text-red-600" />
                  <span>
                    Use <strong>PDF</strong> para relatórios imprimíveis ou para
                    compartilhar com outras pessoas.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FileJson className="w-4 h-4 mt-0.5 text-orange-600" />
                  <span>
                    O formato <strong>JSON</strong> é ideal para desenvolvedores
                    ou para backup de dados.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
