// frontend/src/app/(private)/reports/income-expense/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRelatorios } from "@/hooks";
import { TipoAgrupamento, FormatoExportacao } from "@/types/relatorio";
import { formatarMoeda, formatarPercentual } from "@/utils/formatadores";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";
import { CORES_GRAFICOS } from "@/constants/format";
import { DateRange } from "@/components/ui/date-picker";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Icons
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  LineChart,
  Loader2,
  RefreshCw,
  Table,
  AlertCircle,
} from "lucide-react";

export default function ReceitaDespesaPage() {
  const router = useRouter();
  const {
    relatorioReceitaDespesa,
    isLoading,
    error,
    obterRelatorioReceitaDespesa,
    exportarDados,
    limparErro,
  } = useRelatorios();

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
    agrupamento: TipoAgrupamento.MONTH,
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

  // Memoize a função carregarDados com useCallback
  const carregarDadosCallback = useCallback(() => {
    obterRelatorioReceitaDespesa(
      filtros.dataInicial,
      filtros.dataFinal,
      filtros.agrupamento
    );
  }, [
    filtros.dataInicial,
    filtros.dataFinal,
    filtros.agrupamento,
    obterRelatorioReceitaDespesa,
  ]);

  // Use o callback no useEffect
  useEffect(() => {
    carregarDadosCallback();
  }, [carregarDadosCallback]);

  const carregarDados = () => {
    obterRelatorioReceitaDespesa(
      filtros.dataInicial,
      filtros.dataFinal,
      filtros.agrupamento
    );
  };

  const handleExportar = async (formato: FormatoExportacao) => {
    await exportarDados(filtros.dataInicial, filtros.dataFinal, formato);
  };

  // Preparar dados para gráficos
  const dadosGraficoBarra = {
    labels: relatorioReceitaDespesa?.data.map((item) => item.period) || [],
    datasets: [
      {
        label: "Receitas",
        data: relatorioReceitaDespesa?.data.map((item) => item.incomes) || [],
        backgroundColor: CORES_GRAFICOS.RECEITA,
      },
      {
        label: "Despesas",
        data: relatorioReceitaDespesa?.data.map((item) => item.expenses) || [],
        backgroundColor: CORES_GRAFICOS.DESPESA,
      },
    ],
  };

  const dadosGraficoLinha = {
    labels: relatorioReceitaDespesa?.data.map((item) => item.period) || [],
    datasets: [
      {
        label: "Saldo",
        data: relatorioReceitaDespesa?.data.map((item) => item.balance) || [],
        borderColor: CORES_GRAFICOS.SALDO,
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Opções para gráficos
  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatarMoeda(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
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
            <h1 className="text-3xl font-bold">Receitas vs Despesas</h1>
            <p className="text-muted-foreground">
              Análise comparativa de receitas e despesas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExportar(FormatoExportacao.PDF)}
            disabled={isLoading || !relatorioReceitaDespesa}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Seleção de período */}
            <div className="space-y-2">
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
              <div className="space-y-2 col-span-2">
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

            {/* Seleção de agrupamento */}
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
                  <SelectItem value={TipoAgrupamento.DAY}>Dia</SelectItem>
                  <SelectItem value={TipoAgrupamento.WEEK}>Semana</SelectItem>
                  <SelectItem value={TipoAgrupamento.MONTH}>Mês</SelectItem>
                  <SelectItem value={TipoAgrupamento.QUARTER}>
                    Trimestre
                  </SelectItem>
                  <SelectItem value={TipoAgrupamento.YEAR}>Ano</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Sumário */}
      {relatorioReceitaDespesa && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-green-600">
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">
                {formatarMoeda(relatorioReceitaDespesa.summary.totalIncomes)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-red-600">
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">
                {formatarMoeda(relatorioReceitaDespesa.summary.totalExpenses)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-blue-600">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold text-center ${
                  relatorioReceitaDespesa.summary.totalBalance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatarMoeda(relatorioReceitaDespesa.summary.totalBalance)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos e Tabela */}
      <Tabs defaultValue="grafico-barras">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="grafico-barras" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Gráfico de Barras
          </TabsTrigger>
          <TabsTrigger value="grafico-linha" className="flex items-center">
            <LineChart className="w-4 h-4 mr-2" />
            Gráfico de Saldo
          </TabsTrigger>
          <TabsTrigger value="tabela" className="flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Tabela de Dados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grafico-barras">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Receitas e Despesas</CardTitle>
              <CardDescription>
                Comparação entre receitas e despesas no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : relatorioReceitaDespesa &&
                relatorioReceitaDespesa.data.length > 0 ? (
                <div className="h-80">
                  <Bar data={dadosGraficoBarra} options={opcoesGrafico} />
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

        <TabsContent value="grafico-linha">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Saldo</CardTitle>
              <CardDescription>
                Tendência do saldo no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : relatorioReceitaDespesa &&
                relatorioReceitaDespesa.data.length > 0 ? (
                <div className="h-80">
                  <Line data={dadosGraficoLinha} options={opcoesGrafico} />
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
              <CardTitle>Tabela de Dados</CardTitle>
              <CardDescription>
                Dados detalhados de receitas e despesas
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
              ) : relatorioReceitaDespesa &&
                relatorioReceitaDespesa.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Período</th>
                        <th className="py-2 px-4 text-right">Receitas</th>
                        <th className="py-2 px-4 text-right">Despesas</th>
                        <th className="py-2 px-4 text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorioReceitaDespesa.data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{item.period}</td>
                          <td className="py-3 px-4 text-right font-medium text-green-600">
                            {formatarMoeda(item.incomes)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">
                            {formatarMoeda(item.expenses)}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-medium ${
                              item.balance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatarMoeda(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/20">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">
                          {formatarMoeda(
                            relatorioReceitaDespesa.summary.totalIncomes
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-red-600">
                          {formatarMoeda(
                            relatorioReceitaDespesa.summary.totalExpenses
                          )}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-bold ${
                            relatorioReceitaDespesa.summary.totalBalance >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatarMoeda(
                            relatorioReceitaDespesa.summary.totalBalance
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
