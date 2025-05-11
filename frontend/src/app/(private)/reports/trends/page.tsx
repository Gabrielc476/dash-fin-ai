// frontend/src/app/(private)/reports/trends/page.tsx
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
import { Progress } from "@/components/ui/progress";
import { useRelatorios } from "@/hooks";
import { formatarMoeda, formatarPercentual } from "@/utils/formatadores";
import { ROTAS } from "@/constants/rotas";
import { CORES_GRAFICOS } from "@/constants/format";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Icons
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Download,
  FileText,
  LineChart,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  DollarSign,
  CreditCard,
  Calendar,
  Tag,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";

export default function TendenciasFinanceirasPage() {
  const router = useRouter();
  const { tendencias, isLoading, error, obterTendencias, limparErro } =
    useRelatorios();

  // Estado para filtros
  const [meses, setMeses] = useState(6);

  // Carregar dados quando componente monta
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    obterTendencias(meses);
  };

  // Preparar dados para gráficos
  const dadosGraficoLinha = {
    labels: tendencias?.monthlySummary.map((item) => item.period) || [],
    datasets: [
      {
        label: "Receitas",
        data: tendencias?.monthlySummary.map((item) => item.incomes) || [],
        borderColor: CORES_GRAFICOS.RECEITA,
        backgroundColor: CORES_GRAFICOS.RECEITA,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Despesas",
        data: tendencias?.monthlySummary.map((item) => item.expenses) || [],
        borderColor: CORES_GRAFICOS.DESPESA,
        backgroundColor: CORES_GRAFICOS.DESPESA,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const dadosGraficoSaldo = {
    labels: tendencias?.monthlySummary.map((item) => item.period) || [],
    datasets: [
      {
        label: "Tendência de Saldo",
        data:
          tendencias?.monthlySummary.map(
            (item) => Number(item.incomes) - Number(item.expenses)
          ) || [],
        borderColor: CORES_GRAFICOS.SALDO,
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Opções para gráficos
  const opcoesLinha = {
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

  // Crescimento das Categorias
  const dadosGraficoCategorias = {
    labels:
      tendencias?.categories.slice(0, 5).map((cat) => cat.categoryName) || [],
    datasets: [
      {
        label: "Variação Percentual",
        data:
          tendencias?.categories.slice(0, 5).map((cat) => cat.percentChange) ||
          [],
        backgroundColor:
          tendencias?.categories
            .slice(0, 5)
            .map((cat) =>
              cat.direction === "up"
                ? CORES_GRAFICOS.RECEITA
                : cat.direction === "down"
                ? CORES_GRAFICOS.DESPESA
                : CORES_GRAFICOS.NEUTRO
            ) || [],
        borderWidth: 1,
      },
    ],
  };

  const opcoesBarras = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Variação: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          callback: function (value) {
            return `${value}%`;
          },
        },
      },
    },
  };

  // Indicador de tendência
  const TendenciaIndicator = ({ direction, value }) => {
    return (
      <div className="flex items-center">
        {direction === "upward" ? (
          <Badge className="bg-green-500">
            <TrendingUp className="w-3 h-3 mr-1" />+{value.toFixed(1)}%
          </Badge>
        ) : direction === "downward" ? (
          <Badge className="bg-red-500">
            <TrendingDown className="w-3 h-3 mr-1" />
            {value.toFixed(1)}%
          </Badge>
        ) : (
          <Badge variant="secondary">
            <Minus className="w-3 h-3 mr-1" />
            Estável
          </Badge>
        )}
      </div>
    );
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
            <h1 className="text-3xl font-bold">Tendências Financeiras</h1>
            <p className="text-muted-foreground">
              Análise de tendências e projeções para suas finanças
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={meses.toString()}
            onValueChange={(value) => setMeses(parseInt(value))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Médias e Tendências */}
      {tendencias && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Média de Receitas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Média de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {formatarMoeda(tendencias.averages.incomes)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tendência
                  </span>
                  <TendenciaIndicator
                    direction={tendencias.trends.incomes.direction}
                    value={tendencias.trends.incomes.trend * 100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Média de Despesas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Média de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">
                  {formatarMoeda(tendencias.averages.expenses)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tendência
                  </span>
                  <TendenciaIndicator
                    direction={tendencias.trends.expenses.direction}
                    value={tendencias.trends.expenses.trend * 100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Economia Média Mensal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Economia Média Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div
                  className={`text-2xl font-bold ${
                    tendencias.averages.savings >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatarMoeda(tendencias.averages.savings)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {tendencias.averages.savings >= 0
                      ? `${formatarPercentual(
                          tendencias.averages.savings /
                            tendencias.averages.incomes
                        )} da receita`
                      : "Déficit mensal"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Período Analisado */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Período Analisado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {tendencias.period.months} meses
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(tendencias.period.startDate).toLocaleDateString()}{" "}
                    até{" "}
                    {new Date(tendencias.period.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="w-5 h-5 mr-2" />
              Evolução de Receitas e Despesas
            </CardTitle>
            <CardDescription>
              Tendências dos últimos {meses} meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : tendencias ? (
              <div className="h-64">
                <Line data={dadosGraficoLinha} options={opcoesLinha} />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Dados não disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Saldo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Tendência de Saldo
            </CardTitle>
            <CardDescription>Evolução do saldo mensal</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : tendencias ? (
              <div className="h-64">
                <Line data={dadosGraficoSaldo} options={opcoesLinha} />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Dados não disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Categorias com Maior Variação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Categorias com Maior Variação
          </CardTitle>
          <CardDescription>
            Categorias que mais mudaram em relação ao período anterior
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : tendencias && tendencias.categories.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Barras */}
              <div className="h-80">
                <Bar data={dadosGraficoCategorias} options={opcoesBarras} />
              </div>

              {/* Lista Detalhada */}
              <div className="space-y-4">
                {tendencias.categories.slice(0, 5).map((categoria, index) => (
                  <div key={index} className="space-y-1 border-b pb-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {categoria.categoryName}
                      </div>
                      <Badge
                        variant={
                          categoria.direction === "up"
                            ? "destructive"
                            : categoria.direction === "down"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {categoria.direction === "up" ? (
                          <ChevronUp className="w-3 h-3 mr-1" />
                        ) : categoria.direction === "down" ? (
                          <ChevronDown className="w-3 h-3 mr-1" />
                        ) : (
                          <Minus className="w-3 h-3 mr-1" />
                        )}
                        {categoria.percentChange > 0 ? "+" : ""}
                        {categoria.percentChange.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Atual:</span>
                      <span className="font-medium">
                        {formatarMoeda(categoria.currentValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Anterior:</span>
                      <span className="font-medium">
                        {formatarMoeda(categoria.previousValue)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(Math.abs(categoria.percentChange), 100)}
                      className="h-1 mt-1"
                      indicatorClassName={
                        categoria.direction === "up"
                          ? "bg-red-500"
                          : categoria.direction === "down"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Dados insuficientes para análise de tendência por categoria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projeções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Projeções para os Próximos Meses
          </CardTitle>
          <CardDescription>
            Previsões baseadas nas tendências atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : tendencias ? (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p>
                  Com base nas tendências dos últimos {tendencias.period.months}{" "}
                  meses, é possível projetar as seguintes situações:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                      <h3 className="text-base font-medium">Receitas</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tendencias.trends.incomes.direction === "upward"
                        ? `Suas receitas estão em crescimento (${(
                            tendencias.trends.incomes.trend * 100
                          ).toFixed(
                            1
                          )}%). Se essa tendência continuar, você pode esperar um aumento nos próximos meses.`
                        : tendencias.trends.incomes.direction === "downward"
                        ? `Suas receitas estão em queda (${(
                            tendencias.trends.incomes.trend * 100
                          ).toFixed(
                            1
                          )}%). É recomendável revisar suas fontes de renda.`
                        : `Suas receitas estão estáveis. Você pode esperar um valor mensal próximo a ${formatarMoeda(
                            tendencias.averages.incomes
                          )}.`}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors space-y-2">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-red-500" />
                      <h3 className="text-base font-medium">Despesas</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tendencias.trends.expenses.direction === "upward"
                        ? `Suas despesas estão aumentando (${(
                            tendencias.trends.expenses.trend * 100
                          ).toFixed(
                            1
                          )}%). Considere revisar seu orçamento para controlar esse crescimento.`
                        : tendencias.trends.expenses.direction === "downward"
                        ? `Suas despesas estão diminuindo (${(
                            tendencias.trends.expenses.trend * 100
                          ).toFixed(
                            1
                          )}%). Continue com essa tendência positiva.`
                        : `Suas despesas estão estáveis. Você pode prever gastos mensais em torno de ${formatarMoeda(
                            tendencias.averages.expenses
                          )}.`}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="text-base font-medium">
                    Projeção de Saldo para os Próximos 3 Meses
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {tendencias.averages.savings >= 0
                      ? `Mantendo as tendências atuais, você poderá acumular aproximadamente ${formatarMoeda(
                          tendencias.averages.savings * 3
                        )} nos próximos 3 meses.`
                      : `Se as tendências atuais continuarem, você terá um déficit de aproximadamente ${formatarMoeda(
                          Math.abs(tendencias.averages.savings * 3)
                        )} nos próximos 3 meses. Considere ajustar seu orçamento.`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Dados insuficientes para projeções</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
