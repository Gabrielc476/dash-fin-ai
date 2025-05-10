// frontend/src/app/(private)/dashboard/page.tsx
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
  Filler,
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
  PointElement,
  Filler
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hooks
import {
  useAuth,
  useTransacoes,
  useCategorias,
  useOrcamentosAvancado,
  useIaInsights,
  useRelatorios,
} from "@/hooks";

// Utils
import { formatarMoeda, formatarPercentual } from "@/utils/formatadores";
import { formatarData } from "@/utils/formatadores";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";
import { CORES_GRAFICOS } from "@/constants/format";

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
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Eye,
  MoreVertical,
  ChevronRight,
  Wallet,
  CreditCard,
  Calculator,
  FileText,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // Estado do período selecionado
  const [periodoSelecionado, setPeriodoSelecionado] = useState("mes");

  // Hooks para dados
  const {
    transacoes,
    buscarTransacoes,
    buscarResumoPorCategoria,
    buscarResumoMensal,
  } = useTransacoes();

  const { categorias, buscarCategorias } = useCategorias();

  const {
    orcamentosComProgresso,
    estaCarregandoProgresso,
    carregarOrcamentosComProgresso,
    obterRecomendacoesOrcamento,
    calcularTotaisOrcamento,
  } = useOrcamentosAvancado();

  const {
    insights,
    gerarInsights,
    isLoading: isLoadingInsights,
    obterSaudeFinanceira,
    saudeFinanceira,
  } = useIaInsights();

  const { obterTendencias, tendencias } = useRelatorios();

  // Estados locais
  const [resumoCategorias, setResumoCategorias] = useState([]);
  const [resumoMensal, setResumoMensal] = useState([]);
  const [isLoadingDados, setIsLoadingDados] = useState(true);
  const [errorDados, setErrorDados] = useState<string | null>(null);
  const [recomendacoesOrcamento, setRecomendacoesOrcamento] = useState([]);

  // Período atual baseado na seleção
  const periodoAtual = obterPeriodo(periodoSelecionado);

  // Carregar dados ao montar componente
  useEffect(() => {
    carregarDadosDashboard();
    carregarDadosExtras();
  }, [periodoSelecionado]);

  const carregarDadosDashboard = async () => {
    setIsLoadingDados(true);
    setErrorDados(null);

    try {
      // Buscar categorias
      await buscarCategorias();

      // Buscar transações do período selecionado
      await buscarTransacoes({
        startDate: formatarDataParaAPI(periodoAtual.inicio),
        endDate: formatarDataParaAPI(periodoAtual.fim),
      });

      // Buscar resumo por categoria
      const resumo = await buscarResumoPorCategoria(
        formatarDataParaAPI(periodoAtual.inicio),
        formatarDataParaAPI(periodoAtual.fim)
      );
      setResumoCategorias(resumo);

      // Buscar orçamentos com progresso
      await carregarOrcamentosComProgresso();

      // Buscar dados mensais para gráficos
      await carregarResumoMensal();
    } catch (error: any) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setErrorDados(error.message || "Erro ao carregar dados");
    } finally {
      setIsLoadingDados(false);
    }
  };

  const carregarDadosExtras = async () => {
    try {
      // Buscar saúde financeira
      await obterSaudeFinanceira();

      // Buscar tendências
      await obterTendencias(6);

      // Buscar recomendações de orçamento
      const recomendacoes = await obterRecomendacoesOrcamento();
      setRecomendacoesOrcamento(recomendacoes);
    } catch (error) {
      console.error("Erro ao carregar dados extras:", error);
    }
  };

  const carregarResumoMensal = async () => {
    // Carregar últimos 12 meses
    const hoje = new Date();
    const meses = [];

    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje);
      data.setMonth(data.getMonth() - i);
      const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
      const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0);

      meses.push({
        inicio,
        fim,
        mes: inicio.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
      });
    }

    // Buscar resumo para cada mês
    const resumos = await Promise.all(
      meses.map(async (mes) => {
        const resumo = await buscarResumoMensal(
          formatarDataParaAPI(mes.inicio),
          formatarDataParaAPI(mes.fim)
        );

        return {
          mes: mes.mes,
          receitas: resumo[0]?.incomes || 0,
          despesas: resumo[0]?.expenses || 0,
          saldo: (resumo[0]?.incomes || 0) - (resumo[0]?.expenses || 0),
        };
      })
    );

    setResumoMensal(resumos);
  };

  // Calcular totais e variações
  const calcularMetricas = () => {
    const receitas = transacoes
      .filter((t) => !t.isExpense)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesas = transacoes
      .filter((t) => t.isExpense)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const saldo = receitas - despesas;

    // Calcular variações em relação ao período anterior
    const ultimosPeriodos = resumoMensal.slice(-2);
    const periodoAtual = ultimosPeriodos[1];
    const periodoAnterior = ultimosPeriodos[0];

    const variacaoReceitas = periodoAnterior?.receitas
      ? ((receitas - periodoAnterior.receitas) / periodoAnterior.receitas) * 100
      : 0;

    const variacaoDespesas = periodoAnterior?.despesas
      ? ((despesas - periodoAnterior.despesas) / periodoAnterior.despesas) * 100
      : 0;

    const taxaEconomia = receitas > 0 ? (saldo / receitas) * 100 : 0;

    return {
      receitas,
      despesas,
      saldo,
      taxaEconomia,
      variacaoReceitas,
      variacaoDespesas,
    };
  };

  const metricas = calcularMetricas();

  // Configurações dos gráficos
  const dadosGraficoCategorias = {
    labels: resumoCategorias.map((cat) => cat.categoryName),
    datasets: [
      {
        data: resumoCategorias.map((cat) => Number(cat.total)),
        backgroundColor: resumoCategorias.map(
          (cat) =>
            cat.categoryColor ||
            CORES_GRAFICOS.PALETA[cat.categoryId % CORES_GRAFICOS.PALETA.length]
        ),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const dadosGraficoMensal = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Receitas",
        data: resumoMensal.map((item) => item.receitas),
        backgroundColor: CORES_GRAFICOS.RECEITA,
        borderColor: CORES_GRAFICOS.RECEITA,
        borderWidth: 2,
        borderRadius: 6,
        tension: 0.4,
      },
      {
        label: "Despesas",
        data: resumoMensal.map((item) => item.despesas),
        backgroundColor: CORES_GRAFICOS.DESPESA,
        borderColor: CORES_GRAFICOS.DESPESA,
        borderWidth: 2,
        borderRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const dadosGraficoSaldo = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Saldo",
        data: resumoMensal.map((item) => item.saldo),
        borderColor: CORES_GRAFICOS.SALDO,
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 3,
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
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        padding: 16,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce(
              (a, b) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatarMoeda(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  const optionsGraficoSaldo: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 16,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `Saldo: ${formatarMoeda(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => formatarMoeda(value as number),
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Componente para os cards de métricas melhorados
  const CardMetricaMelhorada = ({
    titulo,
    valor,
    icone,
    cor,
    tendencia,
    descricao,
    link,
  }: {
    titulo: string;
    valor: number | string;
    icone: any;
    cor: string;
    tendencia?: { porcentagem: number; positiva: boolean };
    descricao?: string;
    link?: string;
  }) => {
    const Icon = icone;
    return (
      <Card className="hover:shadow-lg transition-all duration-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent via-muted/20 to-muted/30 rounded-full transform translate-x-16 -translate-y-16" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {titulo}
              </p>
              <h3 className={`text-2xl font-bold ${cor}`}>
                {typeof valor === "number" ? formatarMoeda(valor) : valor}
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
                    vs. período anterior
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
        {link && (
          <CardFooter className="p-3 pt-0">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8"
              onClick={() => router.push(link)}
            >
              Ver detalhes
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  // Componente de Saúde Financeira
  const SaudeFinanceiraCard = () => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-primary" />
            Saúde Financeira
          </div>
          {saudeFinanceira && (
            <Badge
              variant={
                saudeFinanceira.pontuacao_saude >= 7
                  ? "default"
                  : saudeFinanceira.pontuacao_saude >= 4
                  ? "secondary"
                  : "destructive"
              }
              className="text-lg px-3 py-1"
            >
              {saudeFinanceira.pontuacao_saude.toFixed(1)}/10
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {saudeFinanceira ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {saudeFinanceira.resumo}
            </p>
            <div className="space-y-3">
              {saudeFinanceira.avaliacoes
                .slice(0, 3)
                .map((avaliacao, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`p-1 rounded-full ${
                        avaliacao.pontuacao >= 7
                          ? "bg-green-100 text-green-600"
                          : avaliacao.pontuacao >= 4
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {avaliacao.area}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {avaliacao.pontuacao}/10
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {avaliacao.analise}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => obterSaudeFinanceira()}
          disabled={!saudeFinanceira}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Análise
        </Button>
      </CardFooter>
    </Card>
  );

  // Componente de Alertas e Recomendações
  const AlertasRecomendacoesCard = () => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
          Alertas & Recomendações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recomendacoesOrcamento.length > 0 || insights.length > 0 ? (
          <div className="space-y-3">
            {/* Alertas de Orçamento */}
            {recomendacoesOrcamento
              .filter((rec) => rec.tipo === "alerta")
              .map((alerta, index) => (
                <Alert
                  key={`alerta-${index}`}
                  variant="destructive"
                  className="py-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <p className="font-medium">{alerta.titulo}</p>
                    <p className="text-xs mt-1">{alerta.descricao}</p>
                  </AlertDescription>
                </Alert>
              ))}

            {/* Insights Relevantes */}
            {insights
              .filter((insight) => insight.relevanceScore >= 8)
              .slice(0, 2)
              .map((insight) => (
                <Alert key={insight.id} className="py-2">
                  <Sparkles className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <p className="font-medium">{insight.title}</p>
                    <p className="text-xs mt-1">{insight.description}</p>
                  </AlertDescription>
                </Alert>
              ))}

            {/* Recomendações de Economia */}
            {recomendacoesOrcamento
              .filter((rec) => rec.tipo === "informacao")
              .slice(0, 1)
              .map((rec, index) => (
                <Alert key={`rec-${index}`} className="py-2">
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <p className="font-medium">{rec.titulo}</p>
                    <p className="text-xs mt-1">{rec.descricao}</p>
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tudo parece estar em ordem!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Componente de Ações Rápidas
  const AcoesRapidasCard = () => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center"
            onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.ADICIONAR)}
          >
            <Plus className="w-4 h-4 mb-1" />
            <span className="text-xs">Nova Transação</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center"
            onClick={() => router.push(ROTAS.PRIVATE.ORCAMENTOS.ADICIONAR)}
          >
            <Target className="w-4 h-4 mb-1" />
            <span className="text-xs">Novo Orçamento</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center"
            onClick={() => router.push(ROTAS.PRIVATE.RELATORIOS.INICIO)}
          >
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-xs">Relatórios</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex flex-col items-center"
            onClick={() => gerarInsights()}
            disabled={isLoadingInsights}
          >
            {isLoadingInsights ? (
              <Loader2 className="w-4 h-4 mb-1 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mb-1" />
            )}
            <span className="text-xs">Gerar Insights</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Componente de Últimas Transações Melhorado
  const UltimasTransacoesCard = () => {
    const ultimasTransacoes = transacoes
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);

    return (
      <Card>
        <CardHeader className="pb-2">
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
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDados ? (
            <div className="space-y-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
            </div>
          ) : ultimasTransacoes.length > 0 ? (
            <div className="space-y-3">
              {ultimasTransacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className="flex justify-between items-center py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(ROTAS.PRIVATE.TRANSACOES.DETALHE(transacao.id))
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        transacao.isExpense ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {transacao.isExpense ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {transacao.description}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>
                          {transacao.category?.name || "Sem categoria"}
                        </span>
                        <span>•</span>
                        <span>
                          {formatarData(new Date(transacao.date), "dd/MM")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium text-sm ${
                        transacao.isExpense ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transacao.isExpense ? "-" : "+"}
                      {formatarMoeda(transacao.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transacao.paymentMethod || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma transação encontrada</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push(ROTAS.PRIVATE.TRANSACOES.ADICIONAR)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Transação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Componente de Orçamentos Melhorado
  const ResumoOrcamentosCard = () => {
    const totais = calcularTotaisOrcamento();
    const orcamentosExcedidos = orcamentosComProgresso.filter(
      (o) => o.progresso.situacao === "excedido"
    ).length;

    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Orçamentos
            </div>
            <Badge
              variant={orcamentosExcedidos > 0 ? "destructive" : "secondary"}
            >
              {orcamentosComProgresso.length} ativo
              {orcamentosComProgresso.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Totais gerais */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total orçado:</span>
              <span className="font-medium">
                {formatarMoeda(totais.totalOrcado)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total gasto:</span>
              <span
                className={`font-medium ${
                  totais.percentualTotal > 100
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {formatarMoeda(totais.totalGasto)}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso geral</span>
                <span>{formatarPercentual(totais.percentualTotal / 100)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    totais.percentualTotal > 100 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(totais.percentualTotal, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Lista de orçamentos */}
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
              {orcamentosComProgresso.slice(0, 4).map((orcamento) => (
                <div key={orcamento.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{orcamento.name}</span>
                      {orcamento.progresso.situacao === "excedido" && (
                        <Badge
                          variant="destructive"
                          className="h-4 text-xs px-1"
                        >
                          Excedido
                        </Badge>
                      )}
                      {orcamento.progresso.situacao === "atencao" && (
                        <Badge variant="secondary" className="h-4 text-xs px-1">
                          Atenção
                        </Badge>
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        orcamento.progresso.situacao === "excedido"
                          ? "text-red-600"
                          : orcamento.progresso.situacao === "atencao"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatarMoeda(orcamento.progresso.valorGasto)} /{" "}
                      {formatarMoeda(orcamento.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
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
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {formatarPercentual(
                        orcamento.progresso.percentualGasto / 100
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum orçamento ativo</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push(ROTAS.PRIVATE.ORCAMENTOS.ADICIONAR)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Orçamento
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
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

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Badge variant="outline">{user?.name || "Usuário"}</Badge>
          </div>
          <p className="text-muted-foreground">
            Visão geral das suas finanças em{" "}
            {periodoAtual.inicio.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={periodoSelecionado}
            onValueChange={setPeriodoSelecionado}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={carregarDadosDashboard} disabled={isLoadingDados}>
            {isLoadingDados ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Erro */}
      {errorDados && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{errorDados}</AlertDescription>
        </Alert>
      )}

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingDados ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))
        ) : (
          <>
            <CardMetricaMelhorada
              titulo="Total em Receitas"
              valor={metricas.receitas}
              icone={TrendingUp}
              cor="text-green-600"
              tendencia={{
                porcentagem: metricas.variacaoReceitas,
                positiva: metricas.variacaoReceitas > 0,
              }}
              descricao={`Período atual`}
              link={ROTAS.PRIVATE.TRANSACOES.LISTAR}
            />
            <CardMetricaMelhorada
              titulo="Total em Despesas"
              valor={metricas.despesas}
              icone={TrendingDown}
              cor="text-red-600"
              tendencia={{
                porcentagem: metricas.variacaoDespesas,
                positiva: metricas.variacaoDespesas < 0,
              }}
              descricao={`Período atual`}
              link={ROTAS.PRIVATE.TRANSACOES.LISTAR}
            />
            <CardMetricaMelhorada
              titulo="Saldo Atual"
              valor={metricas.saldo}
              icone={DollarSign}
              cor={metricas.saldo >= 0 ? "text-green-600" : "text-red-600"}
              descricao={
                metricas.saldo >= 0 ? "Saldo positivo" : "Saldo negativo"
              }
              link={ROTAS.PRIVATE.DASHBOARD}
            />
            <CardMetricaMelhorada
              titulo="Taxa de Economia"
              valor={`${formatarPercentual(metricas.taxaEconomia / 100)}`}
              icone={CircleDollarSign}
              cor={
                metricas.taxaEconomia >= 20
                  ? "text-green-600"
                  : metricas.taxaEconomia >= 10
                  ? "text-yellow-600"
                  : "text-red-600"
              }
              descricao="% das receitas economizadas"
              link={ROTAS.PRIVATE.RELATORIOS.TENDENCIAS}
            />
          </>
        )}
      </div>

      {/* Grid Principal com Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráficos - 2 colunas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs para diferentes visualizações */}
          <Tabs defaultValue="categorias" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
              <TabsTrigger value="evolucao">Evolução</TabsTrigger>
              <TabsTrigger value="saldo">Saldo</TabsTrigger>
            </TabsList>

            <TabsContent value="categorias">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Distribuição de Gastos
                  </CardTitle>
                  <CardDescription>
                    Gastos por categoria no período selecionado
                  </CardDescription>
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
            </TabsContent>

            <TabsContent value="evolucao">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription>
                    Receitas vs Despesas - Últimos 12 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDados ? (
                    <Skeleton className="h-72 w-full" />
                  ) : resumoMensal.length > 0 ? (
                    <div className="h-72">
                      <Bar
                        data={dadosGraficoMensal}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: "top" as const,
                              labels: {
                                usePointStyle: true,
                                pointStyle: "circle",
                                padding: 20,
                              },
                            },
                            tooltip: {
                              mode: "index",
                              intersect: false,
                              backgroundColor: "rgba(0, 0, 0, 0.9)",
                              titleFont: { size: 14 },
                              bodyFont: { size: 13 },
                              padding: 12,
                              cornerRadius: 8,
                              callbacks: {
                                label: (context) => {
                                  const value = context.raw as number;
                                  return `${
                                    context.dataset.label
                                  }: ${formatarMoeda(value)}`;
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
                                callback: (value) =>
                                  formatarMoeda(value as number),
                              },
                            },
                          },
                        }}
                      />
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
            </TabsContent>

            <TabsContent value="saldo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineElement className="w-5 h-5 mr-2" />
                    Evolução do Saldo
                  </CardTitle>
                  <CardDescription>
                    Tendência do saldo ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDados ? (
                    <Skeleton className="h-72 w-full" />
                  ) : resumoMensal.length > 0 ? (
                    <div className="h-72">
                      <Line
                        data={dadosGraficoSaldo}
                        options={optionsGraficoSaldo}
                      />
                    </div>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <LineElement className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Dados insuficientes para o gráfico</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1 coluna */}
        <div className="space-y-6">
          <SaudeFinanceiraCard />
          <AcoesRapidasCard />
          <AlertasRecomendacoesCard />
        </div>
      </div>

      {/* Grid Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimas Transações - 2 colunas */}
        <div className="lg:col-span-2">
          <UltimasTransacoesCard />
        </div>

        {/* Resumo de Orçamentos - 1 coluna */}
        <ResumoOrcamentosCard />
      </div>

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
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gerar Novos
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Recomendações personalizadas baseadas em seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInsights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2 p-4 border rounded-lg">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
            </div>
          ) : insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.slice(0, 6).map((insight) => (
                <div
                  key={insight.id}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(ROTAS.PRIVATE.INSIGHTS.DETALHE(insight.id))
                  }
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{insight.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {insight.relevanceScore}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {insight.description}
                  </p>
                  {insight.impactValue && (
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={
                          insight.impactValue > 0 ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {insight.impactValue > 0 ? "+" : ""}
                        {formatarMoeda(Math.abs(insight.impactValue))}
                      </Badge>
                      {insight.categories && insight.categories.length > 0 && (
                        <div className="flex -space-x-1">
                          {insight.categories.slice(0, 3).map((cat, index) => (
                            <div
                              key={cat.id}
                              className="w-4 h-4 rounded-full border-2 border-background"
                              style={{
                                backgroundColor:
                                  categorias.find((c) => c.id === cat.id)
                                    ?.color || "#666",
                              }}
                              title={cat.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Nenhum insight disponível</p>
              <p className="text-sm mt-1">
                Clique em "Gerar Novos" para receber recomendações
                personalizadas
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(ROTAS.PRIVATE.INSIGHTS.LISTAR)}
          >
            Ver todos os insights
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
