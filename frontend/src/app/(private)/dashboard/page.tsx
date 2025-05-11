// frontend/src/app/(private)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dashboard Components
import { CardMetrica } from "@/components/organismos/dashboard/CardMetrica";
import { GraficosDashboard } from "@/components/organismos/dashboard/GraficosDashboard";
import { TransacoesRecentes } from "@/components/organismos/dashboard/TransacoesRecentes";
import { InsightsDashboard } from "@/components/organismos/dashboard/InsightsDashboard";

// Relatórios Components
import { ResumoFinanceiro } from "@/components/organismos/relatorios/ResumoFinanceiro";
import { RelatoriosRecentes } from "@/components/organismos/relatorios/RelatoriosRecentes";

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
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";

// Icons
import {
  TrendingUp,
  DollarSign,
  RefreshCw,
  Calculator,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Wallet,
  CreditCard,
  CircleDollarSign,
  TrendingDown,
  Plus,
  Sparkles,
  Target,
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
    isLoading: isLoadingTransacoes,
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
  const [errorDados, setErrorDados] = useState(null);
  const [recomendacoesOrcamento, setRecomendacoesOrcamento] = useState([]);

  // Período atual baseado na seleção
  const periodoAtual = obterPeriodo(periodoSelecionado);

  // Carregar dados ao montar componente
  useEffect(() => {
    carregarDadosDashboard();
    carregarDadosExtras();
  }, [periodoSelecionado]);

  // Função para carregar os dados principais do dashboard
  const carregarDadosDashboard = async () => {
    setIsLoadingDados(true);
    setErrorDados(null);

    try {
      await buscarCategorias();
      const dataInicial = formatarDataParaAPI(periodoAtual.inicio);
      const dataFinal = formatarDataParaAPI(periodoAtual.fim);

      await buscarTransacoes({ dataInicial, dataFinal });

      const resumo = await buscarResumoPorCategoria(
        periodoAtual.inicio,
        periodoAtual.fim
      );
      setResumoCategorias(resumo);

      await carregarOrcamentosComProgresso();
      await carregarResumoMensal();
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setErrorDados(error.message || "Erro ao carregar dados");
    } finally {
      setIsLoadingDados(false);
    }
  };

  // Função para carregar dados adicionais
  const carregarDadosExtras = async () => {
    try {
      if (!saudeFinanceira) await obterSaudeFinanceira();
      if (!tendencias) await obterTendencias(6);

      const recomendacoes = await obterRecomendacoesOrcamento();
      setRecomendacoesOrcamento(recomendacoes);
    } catch (error) {
      console.error("Erro ao carregar dados extras:", error);
    }
  };

  // Carregar dados de resumo mensal
  const carregarResumoMensal = async () => {
    try {
      const hoje = new Date();
      const mesInicial = new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1);
      const mesFinal = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      const resumo = await buscarResumoMensal(mesInicial, mesFinal);

      const dadosProcessados = resumo.map((item) => ({
        mes: item.month,
        receitas: Number(item.incomes) || 0,
        despesas: Number(item.expenses) || 0,
        saldo: Number(item.incomes) - Number(item.expenses),
      }));

      setResumoMensal(dadosProcessados);
    } catch (error) {
      console.error("Erro ao carregar resumo mensal:", error);
      setResumoMensal([]);
    }
  };

  // Calcular métricas financeiras
  const calcularMetricas = () => {
    const receitas = transacoes
      .filter((t) => !t.isExpense)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesas = transacoes
      .filter((t) => t.isExpense)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const saldo = receitas - despesas;

    // Calcular variações
    let variacaoReceitas = 0;
    let variacaoDespesas = 0;

    if (resumoMensal.length >= 2) {
      const ultimosPeriodos = resumoMensal.slice(-2);
      const periodoAtual = ultimosPeriodos[1];
      const periodoAnterior = ultimosPeriodos[0];

      if (periodoAnterior?.receitas) {
        variacaoReceitas =
          ((receitas - periodoAnterior.receitas) / periodoAnterior.receitas) *
          100;
      }

      if (periodoAnterior?.despesas) {
        variacaoDespesas =
          ((despesas - periodoAnterior.despesas) / periodoAnterior.despesas) *
          100;
      }
    }

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

  // Componente de Orçamentos
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
            <CardMetrica
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
              onNavegar={router.push}
            />

            <CardMetrica
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
              onNavegar={router.push}
            />

            <CardMetrica
              titulo="Saldo Atual"
              valor={metricas.saldo}
              icone={DollarSign}
              cor={metricas.saldo >= 0 ? "text-green-600" : "text-red-600"}
              descricao={
                metricas.saldo >= 0 ? "Saldo positivo" : "Saldo negativo"
              }
              link={ROTAS.PRIVATE.DASHBOARD}
              onNavegar={router.push}
            />

            <CardMetrica
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
              onNavegar={router.push}
            />
          </>
        )}
      </div>

      {/* Grid Principal com Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráficos - 2 colunas */}
        <div className="lg:col-span-2 space-y-6">
          <GraficosDashboard
            isLoading={isLoadingDados}
            resumoCategorias={resumoCategorias}
            resumoMensal={resumoMensal}
          />
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
          <TransacoesRecentes
            transacoes={transacoes}
            isLoading={isLoadingTransacoes || isLoadingDados}
            onNavegar={router.push}
          />
        </div>

        {/* Resumo de Orçamentos - 1 coluna */}
        <ResumoOrcamentosCard />
      </div>

      {/* Insights de IA */}
      <InsightsDashboard
        insights={insights}
        categorias={categorias}
        isLoading={isLoadingInsights}
        onGerarInsights={gerarInsights}
        onNavegar={router.push}
      />

      {/* Relatórios Recentes - Componente do Sistema de Relatórios */}
      <RelatoriosRecentes
        relatorios={[
          {
            id: "1",
            titulo: "Relatório Mensal de Receitas vs Despesas",
            tipo: "receita-despesa",
            rota: ROTAS.PRIVATE.RELATORIOS.RECEITA_DESPESA,
            dataCriacao: new Date(),
            favorito: true,
            descricao:
              "Relatório gerado automaticamente com base nos seus dados financeiros.",
          },
          {
            id: "2",
            titulo: "Distribuição de Gastos por Categoria",
            tipo: "categoria",
            rota: ROTAS.PRIVATE.RELATORIOS.CATEGORIA,
            dataCriacao: new Date(Date.now() - 86400000),
            favorito: false,
            descricao:
              "Análise detalhada de como seus gastos estão distribuídos entre categorias.",
          },
        ]}
        onAbrir={(relatorio) => router.push(relatorio.rota)}
      />
    </div>
  );
}
