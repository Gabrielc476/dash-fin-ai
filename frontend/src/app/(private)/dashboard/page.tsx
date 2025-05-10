// src/app/(private)/dashboard/page.tsx
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
  LineElement,
  PointElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement
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
  Calendar,
  Target,
  TrendingDown,
  CircleDollarSign,
  Receipt,
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

  // Configuração dos gráficos com temas melhorados
  const dadosGraficoCategorias = {
    labels: resumoCategorias.map((cat) => cat.categoryName),
    datasets: [
      {
        data: resumoCategorias.map((cat) => Number(cat.total)),
        backgroundColor: resumoCategorias.map(
          (cat) => cat.categoryColor || "#6366f1"
        ),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: "#fff",
      },
    ],
  };

  const dadosGraficoMensal = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Receitas",
        data: resumoMensal.map((item) => item.receitas),
        backgroundColor: "rgb(34, 197, 94)",
        borderRadius: 4,
      },
      {
        label: "Despesas",
        data: resumoMensal.map((item) => item.despesas),
        backgroundColor: "rgb(239, 68, 68)",
        borderRadius: 4,
      },
    ],
  };

  const optionsGraficoCategorias: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatarMoeda(value)} (${percentage}%)`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    cutout: "65%",
  };

  const optionsGraficoMensal: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.dataset.label}: ${formatarMoeda(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => formatarMoeda(value as number),
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
    descricao,
  }: {
    titulo: string;
    valor: number;
    icone: any;
    cor: string;
    tendencia?: { porcentagem: number; positiva: boolean };
    descricao?: string;
  }) => {
    const Icon = icone;
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {titulo}
              </p>
              <h3 className={`text-2xl font-bold ${cor}`}>
                {formatarMoeda(valor)}
              </h3>
              {tendencia && (
                <div className="flex items-center gap-1">
                  {tendencia.positiva ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      tendencia.positiva ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(tendencia.porcentagem).toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs. mês anterior
                  </span>
                </div>
              )}
              {descricao && (
                <p className="text-xs text-muted-foreground">{descricao}</p>
              )}
            </div>
            <div
              className={`p-3 rounded-lg bg-opacity-10 ${cor.replace(
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

  // Componente para resumo de orçamentos
  const ResumoOrcamentosCard = () => {
    const orcamentosExcedidos = orcamentosComProgresso.filter(
      (o) => o.progresso.situacao === "excedido"
    ).length;

    const orcamentosAtivos = orcamentosComProgresso.length;

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Orçamentos
            </div>
            <Badge
              variant={orcamentosExcedidos > 0 ? "destructive" : "secondary"}
            >
              {orcamentosAtivos} ativo{orcamentosAtivos !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {estaCarregandoProgresso ? (
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
            </div>
          ) : orcamentosComProgresso.length > 0 ? (
            <div className="space-y-4">
              {orcamentosComProgresso.slice(0, 3).map((orcamento) => (
                <div key={orcamento.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{orcamento.name}</span>
                    <span
                      className={`
                      ${
                        orcamento.progresso.situacao === "excedido"
                          ? "text-red-500"
                          : orcamento.progresso.situacao === "atencao"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }
                    `}
                    >
                      {formatarMoeda(orcamento.progresso.valorGasto)} /{" "}
                      {formatarMoeda(orcamento.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        orcamento.progresso.situacao === "excedido"
                          ? "bg-red-500"
                          : orcamento.progresso.situacao === "atencao"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          orcamento.progresso.percentualGasto,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nenhum orçamento ativo
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => router.push(ROTAS.PRIVATE.ORCAMENTOS.LISTAR)}
          >
            Gerenciar orçamentos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Listar últimas transações
  const ultimasTransacoes = transacoes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas finanças em{" "}
          {periodoAtual.inicio.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Botão de atualizar */}
      <div className="flex justify-end">
        <Button onClick={carregarDadosDashboard} disabled={isLoadingDados}>
          {isLoadingDados ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Atualizar dados
        </Button>
      </div>

      {/* Erro */}
      {errorDados && (
        <Alert variant="destructive">
          <AlertDescription>{errorDados}</AlertDescription>
        </Alert>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingDados ? (
          Array(4)
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
              titulo="Total em Receitas"
              valor={receitas}
              icone={TrendingUp}
              cor="text-green-600"
              descricao="Este mês"
            />
            <CardMetrica
              titulo="Total em Despesas"
              valor={despesas}
              icone={TrendingDown}
              cor="text-red-600"
              descricao="Este mês"
            />
            <CardMetrica
              titulo="Saldo Atual"
              valor={saldo}
              icone={DollarSign}
              cor={saldo >= 0 ? "text-green-600" : "text-red-600"}
              descricao={saldo >= 0 ? "Saldo positivo" : "Saldo negativo"}
            />
            <CardMetrica
              titulo="Taxa de Economia"
              valor={((receitas - despesas) / receitas) * 100}
              icone={CircleDollarSign}
              cor={saldo >= 0 ? "text-green-600" : "text-red-600"}
              descricao="% das receitas"
            />
          </>
        )}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Categorias */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Distribuição de Gastos
            </CardTitle>
            <CardDescription>Gastos por categoria neste mês</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDados ? (
              <Skeleton className="h-64 w-full" />
            ) : resumoCategorias.length > 0 ? (
              <div className="h-64">
                <Doughnut
                  data={dadosGraficoCategorias}
                  options={optionsGraficoCategorias}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum gasto registrado</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo de Orçamentos */}
        <ResumoOrcamentosCard />
      </div>

      {/* Gráfico Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Evolução Mensal
          </CardTitle>
          <CardDescription>
            Receitas vs Despesas - Últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDados ? (
            <Skeleton className="h-72 w-full" />
          ) : resumoMensal.length > 0 ? (
            <div className="h-72">
              <Bar data={dadosGraficoMensal} options={optionsGraficoMensal} />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Dados insuficientes para o gráfico</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Transações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Transações Recentes
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.LISTAR)}
              >
                Ver todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDados ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-1 flex-1">
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
                    className="flex justify-between items-center py-2 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${
                          transacao.isExpense ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {transacao.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transacao.category?.name || "Sem categoria"} •{" "}
                          {formatarData(new Date(transacao.date), "dd/MM")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium text-sm ${
                          transacao.isExpense
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transacao.isExpense ? "-" : "+"}
                        {formatarMoeda(transacao.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma transação encontrada</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.ADICIONAR)}
            >
              Nova transação
            </Button>
          </CardFooter>
        </Card>

        {/* Insights de IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Insights Financeiros
              </div>
              <Button
                onClick={() => gerarInsights()}
                disabled={isLoadingInsights}
                size="sm"
                variant="outline"
              >
                {isLoadingInsights ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Recomendações baseadas em seus dados
            </CardDescription>
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
                  <div
                    key={insight.id}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-sm">{insight.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {insight.relevanceScore}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {insight.description}
                    </p>
                    {insight.impactValue && (
                      <div className="mt-2">
                        <Badge
                          variant={
                            insight.impactValue > 0 ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {insight.impactValue > 0 ? "+" : ""}
                          {formatarMoeda(Math.abs(insight.impactValue))}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Clique em "Gerar" para receber insights
                </p>
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
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
