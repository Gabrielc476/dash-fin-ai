// frontend/src/app/(private)/reports/category/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRelatorios, useCategorias } from "@/hooks";
import { FormatoExportacao } from "@/types/relatorio";
import { formatarMoeda, formatarPercentual } from "@/utils/formatadores";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";
import { CORES_GRAFICOS } from "@/constants/format";

// Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Icons
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  Loader2,
  PieChart,
  RefreshCw,
  Table,
  AlertCircle,
  Tag,
} from "lucide-react";

export default function RelatorioCategoriasPage() {
  const router = useRouter();
  const {
    relatorioCategoria,
    isLoading,
    error,
    obterRelatorioCategoria,
    exportarDados,
    limparErro,
  } = useRelatorios();
  const {
    categorias,
    buscarCategorias,
    isLoading: isLoadingCategorias,
  } = useCategorias();

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    periodo: "mes" as
      | "hoje"
      | "semana"
      | "mes"
      | "trimestre"
      | "ano"
      | "custom",
    dataInicial: new Date(),
    dataFinal: new Date(),
    categoriasIds: [] as number[],
  });

  // Atualizar datas quando o período muda
  useEffect(() => {
    if (filtros.periodo !== "custom") {
      const periodo = obterPeriodo(filtros.periodo);
      setFiltros((prev) => ({
        ...prev,
        dataInicial: periodo.inicio,
        dataFinal: periodo.fim,
      }));
    }
  }, [filtros.periodo]);

  // Carregar dados quando componente monta
  useEffect(() => {
    buscarCategorias();
    carregarDados();
  }, []);

  const carregarDados = () => {
    const categoriaIds =
      filtros.categoriasIds.length > 0 ? filtros.categoriasIds : undefined;
    obterRelatorioCategoria(
      filtros.dataInicial,
      filtros.dataFinal,
      categoriaIds
    );
  };

  const handleExportar = async (formato: FormatoExportacao) => {
    await exportarDados(filtros.dataInicial, filtros.dataFinal, formato);
  };

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

  // Preparar dados para gráficos
  const dadosGraficoPizza = {
    labels: relatorioCategoria?.data.map((item) => item.categoryName) || [],
    datasets: [
      {
        data: relatorioCategoria?.data.map((item) => item.total) || [],
        backgroundColor:
          relatorioCategoria?.data.map(
            (item) => item.categoryColor || "#666"
          ) || [],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };

  const dadosGraficoBarras = {
    labels: relatorioCategoria?.data.map((item) => item.categoryName) || [],
    datasets: [
      {
        label: "Gastos por Categoria",
        data: relatorioCategoria?.data.map((item) => item.total) || [],
        backgroundColor:
          relatorioCategoria?.data.map(
            (item) => item.categoryColor || "#666"
          ) || [],
        borderWidth: 1,
      },
    ],
  };

  // Opções para gráficos
  const opcoesPizza = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw as number;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatarMoeda(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const opcoesBarras = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.x !== null) {
              label += formatarMoeda(context.parsed.x);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return formatarMoeda(value);
          },
        },
      },
    },
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
            <h1 className="text-3xl font-bold">Relatório por Categoria</h1>
            <p className="text-muted-foreground">
              Análise de gastos distribuídos por categoria
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExportar(FormatoExportacao.PDF)}
            disabled={isLoading || !relatorioCategoria}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={carregarDados} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros e Opções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Seleção de período */}
              <div>
                <label className="text-sm font-medium">Período</label>
                <Select
                  value={filtros.periodo}
                  onValueChange={(valor) =>
                    setFiltros({ ...filtros, periodo: valor as any })
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
              </div>

              {/* Seleção de datas personalizada */}
              {filtros.periodo === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Intervalo de Datas
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="w-full h-10 px-3 py-2 border rounded-md"
                        value={format(filtros.dataInicial, "yyyy-MM-dd")}
                        onChange={(e) =>
                          setFiltros({
                            ...filtros,
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
                        value={format(filtros.dataFinal, "yyyy-MM-dd")}
                        onChange={(e) =>
                          setFiltros({
                            ...filtros,
                            dataFinal: new Date(e.target.value),
                          })
                        }
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filtro de categorias */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Categorias</span>
                <span className="text-xs text-muted-foreground">
                  {filtros.categoriasIds.length > 0
                    ? `${filtros.categoriasIds.length} selecionadas`
                    : "Todas"}
                </span>
              </label>
              <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
                {isLoadingCategorias ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : categorias.length > 0 ? (
                  <div className="space-y-2">
                    {categorias
                      .filter((categoria) => categoria.isExpense)
                      .map((categoria) => (
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={carregarDados} disabled={isLoading}>
            Aplicar Filtros
          </Button>
        </CardFooter>
      </Card>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Total de Despesas */}
      {relatorioCategoria && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center">Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-red-600">
              {formatarMoeda(relatorioCategoria.totalExpenses)}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-1">
              {format(filtros.dataInicial, "dd/MM/yyyy", { locale: ptBR })} até{" "}
              {format(filtros.dataFinal, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Gráficos e Tabela */}
      <Tabs defaultValue="grafico-pizza">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="grafico-pizza" className="flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Gráfico de Pizza
          </TabsTrigger>
          <TabsTrigger value="grafico-barras" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Gráfico de Barras
          </TabsTrigger>
          <TabsTrigger value="tabela" className="flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Tabela de Dados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grafico-pizza">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Gastos por Categoria</CardTitle>
              <CardDescription>
                Visualização em pizza da proporção de gastos em cada categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : relatorioCategoria && relatorioCategoria.data.length > 0 ? (
                <div className="h-80">
                  <Doughnut data={dadosGraficoPizza} options={opcoesPizza} />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Nenhum dado para exibir no período selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grafico-barras">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Gastos por Categoria</CardTitle>
              <CardDescription>
                Comparação de valores gastos em cada categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : relatorioCategoria && relatorioCategoria.data.length > 0 ? (
                <div className="h-80">
                  <Bar data={dadosGraficoBarras} options={opcoesBarras} />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Nenhum dado para exibir no período selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tabela">
          <Card>
            <CardHeader>
              <CardTitle>Tabela de Gastos por Categoria</CardTitle>
              <CardDescription>
                Dados detalhados dos gastos em cada categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : relatorioCategoria && relatorioCategoria.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Categoria</th>
                        <th className="py-2 px-4 text-right">Valor</th>
                        <th className="py-2 px-4 text-right">Percentual</th>
                        <th className="py-2 px-4 text-right">Transações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorioCategoria.data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.categoryColor }}
                              />
                              {item.categoryName}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatarMoeda(item.total)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatarPercentual(item.percentage / 100)}
                          </td>
                          <td className="py-3 px-4 text-right">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/20">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatarMoeda(relatorioCategoria.totalExpenses)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">100%</td>
                        <td className="py-3 px-4 text-right font-bold">
                          {relatorioCategoria.data.reduce(
                            (sum, item) => sum + item.count,
                            0
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Nenhum dado para exibir no período selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
