// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartOptions,
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

// Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumoOrcamentos } from "@/components/organismos/dashboard/ResumoOrcamentos";

// Hooks
import {
  useAuth,
  useTransacoes,
  useCategorias,
  useOrcamentosAvancado,
  useIaInsights,
} from "@/hooks";

// Utils
import { formatarMoeda } from "@/utils/formatadores";
import { formatarData } from "@/utils/formatadores";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";

// Icons
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowRight,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // Hooks para dados
  const { transacoes, buscarTransacoes, buscarResumoPorCategoria } =
    useTransacoes();
  const { categorias, buscarCategorias } = useCategorias();
  const {
    orcamentosComProgresso,
    estaCarregandoProgresso,
    carregarOrcamentosComProgresso,
  } = useOrcamentosAvancado();
  const {
    insights,
    gerarInsights,
    isLoading: isLoadingInsights,
  } = useIaInsights();

  // Estados locais
  const [resumoCategorias, setResumoCategorias] = useState([]);
  const [resumoMensal, setResumoMensal] = useState([]);
  const [isLoadingDados, setIsLoadingDados] = useState(true);
  const [errorDados, setErrorDados] = useState<string | null>(null);

  // Período atual (mês atual)
  const periodoAtual = obterPeriodo("mes");

  // Carregar dados ao montar componente
  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = async () => {
    setIsLoadingDados(true);
    setErrorDados(null);

    try {
      // Buscar categorias
      await buscarCategorias();

      // Buscar transações do mês atual
      await buscarTransacoes({
        dataInicial: formatarDataParaAPI(periodoAtual.inicio),
        dataFinal: formatarDataParaAPI(periodoAtual.fim),
      });

      // Buscar resumo por categoria
      const resumo = await buscarResumoPorCategoria(
        periodoAtual.inicio,
        periodoAtual.fim
      );
      setResumoCategorias(resumo);

      // Buscar orçamentos com progresso
      await carregarOrcamentosComProgresso();

      // Buscar dados dos últimos 6 meses
      await carregarResumoMensal();
    } catch (error: any) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setErrorDados(error.message || "Erro ao carregar dados");
    } finally {
      setIsLoadingDados(false);
    }
  };

  const carregarResumoMensal = async () => {
    const ultimosMeses = [];
    const hoje = new Date();

    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje);
      data.setMonth(data.getMonth() - i);
      const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
      const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0);

      ultimosMeses.push({
        inicio,
        fim,
        mes: inicio.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
      });
    }

    // Buscar transações para cada mês
    const resumos = [];
    for (const mes of ultimosMeses) {
      const transacoesMes = await buscarTransacoes({
        dataInicial: formatarDataParaAPI(mes.inicio),
        dataFinal: formatarDataParaAPI(mes.fim),
      });

      const receitas = transacoesMes
        .filter((t) => !t.isExpense)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const despesas = transacoesMes
        .filter((t) => t.isExpense)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      resumos.push({
        mes: mes.mes,
        receitas,
        despesas,
      });
    }

    setResumoMensal(resumos);
  };

  // Calcular totais
  const calcularTotais = () => {
    const receitas = transacoes
      .filter((t) => !t.isExpense)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesas = transacoes
      .filter((t) => t.isExpense)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const saldo = receitas - despesas;

    return { receitas, despesas, saldo };
  };

  const { receitas, despesas, saldo } = calcularTotais();

  // Configuração dos gráficos
  const dadosGraficoCategorias = {
    labels: resumoCategorias.map((cat) => cat.categoryName),
    datasets: [
      {
        data: resumoCategorias.map((cat) => Number(cat.total)),
        backgroundColor: resumoCategorias.map((cat) => cat.categoryColor),
        borderWidth: 0,
      },
    ],
  };

  const dadosGraficoMensal = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Receitas",
        data: resumoMensal.map((item) => item.receitas),
        backgroundColor: "#4CAF50",
      },
      {
        label: "Despesas",
        data: resumoMensal.map((item) => item.despesas),
        backgroundColor: "#FF5733",
      },
    ],
  };

  const optionsGraficoCategorias: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.label}: ${formatarMoeda(value)}`;
          },
        },
      },
    },
  };

  const optionsGraficoMensal: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.dataset.label}: ${formatarMoeda(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatarMoeda(value),
        },
      },
    },
  };

  // Componente para os cards de métricas
  const CardMetrica = ({
    titulo,
    valor,
    icone,
    cor,
    tendencia,
  }: {
    titulo: string;
    valor: number;
    icone: any;
    cor: string;
    tendencia?: { porcentagem: number; positiva: boolean };
  }) => {
    const Icon = icone;
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {titulo}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${cor}`}>
                {formatarMoeda(valor)}
              </h3>
              {tendencia && (
                <div className="flex items-center mt-1">
                  {tendencia.positiva ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      tendencia.positiva ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(tendencia.porcentagem).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div
              className={`p-3 rounded-full bg-opacity-10 ${cor.replace(
                "text-",
                "bg-"
              )}`}
            >
              <Icon className={`w-6 h-6 ${cor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Listar últimas transações
  const ultimasTransacoes = transacoes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Bem-vindo de volta, {user?.name}!
              </p>
            </div>
            <Button onClick={carregarDadosDashboard} disabled={isLoadingDados}>
              {isLoadingDados ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>

          {/* Erro */}
          {errorDados && (
            <Alert variant="destructive">
              <AlertDescription>{errorDados}</AlertDescription>
            </Alert>
          )}

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingDados ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))
            ) : (
              <>
                <CardMetrica
                  titulo="Receitas"
                  valor={receitas}
                  icone={TrendingUp}
                  cor="text-green-600"
                />
                <CardMetrica
                  titulo="Despesas"
                  valor={despesas}
                  icone={ArrowDownRight}
                  cor="text-red-600"
                />
                <CardMetrica
                  titulo="Saldo"
                  valor={saldo}
                  icone={DollarSign}
                  cor={saldo >= 0 ? "text-green-600" : "text-red-600"}
                />
              </>
            )}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Categorias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Gastos por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDados ? (
                  <Skeleton className="h-72 w-full" />
                ) : resumoCategorias.length > 0 ? (
                  <div className="h-72">
                    <Doughnut
                      data={dadosGraficoCategorias}
                      options={optionsGraficoCategorias}
                    />
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    Nenhum gasto registrado neste período
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico Mensal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Receitas vs Despesas (6 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDados ? (
                  <Skeleton className="h-72 w-full" />
                ) : resumoMensal.length > 0 ? (
                  <div className="h-72">
                    <Bar
                      data={dadosGraficoMensal}
                      options={optionsGraficoMensal}
                    />
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Últimas Transações e Orçamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimas Transações */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDados ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : ultimasTransacoes.length > 0 ? (
                  <div className="space-y-4">
                    {ultimasTransacoes.map((transacao) => (
                      <div
                        key={transacao.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div>
                          <div className="font-medium">
                            {transacao.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transacao.category?.name || "Sem categoria"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              transacao.isExpense
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {transacao.isExpense ? "-" : "+"}
                            {formatarMoeda(transacao.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatarData(new Date(transacao.date))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma transação encontrada
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.LISTAR)}
                >
                  Ver todas as transações
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Resumo de Orçamentos */}
            <ResumoOrcamentos
              orcamentos={orcamentosComProgresso}
              progressos={orcamentosComProgresso.reduce((acc, orcamento) => {
                if (orcamento.progresso) {
                  acc[orcamento.id] = {
                    spent: orcamento.progresso.valorGasto,
                    remaining: orcamento.progresso.valorRestante,
                    percentage: orcamento.progresso.percentualGasto,
                    isOverBudget: orcamento.progresso.situacao === "excedido",
                  };
                }
                return acc;
              }, {})}
              isLoading={estaCarregandoProgresso}
            />
          </div>

          {/* Insights de IA */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Insights com IA
                  </CardTitle>
                  <CardDescription>
                    Recomendações personalizadas baseadas em seus dados
                  </CardDescription>
                </div>
                <Button
                  onClick={() => gerarInsights()}
                  disabled={isLoadingInsights}
                  size="sm"
                >
                  {isLoadingInsights ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Insights
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingInsights ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))}
                </div>
              ) : insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge variant="outline">
                          {insight.relevanceScore}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                      {insight.impactValue && (
                        <div className="mt-2">
                          <span
                            className={`text-sm font-medium ${
                              insight.impactValue > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {insight.impactValue > 0 ? "+" : ""}
                            {formatarMoeda(insight.impactValue)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Clique em "Gerar Insights" para receber recomendações
                  personalizadas
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push(ROTAS.PRIVATE.INSIGHTS.LISTAR)}
              >
                Ver todos os insights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
