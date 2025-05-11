// frontend/src/components/organismos/dashboard/GraficosDashboard/index.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatarMoeda } from "@/utils/formatadores";
import { CORES_GRAFICOS } from "@/constants/format";
import { PieChart, BarChart3, LineChart } from "lucide-react";

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
  LineElement,
  PointElement,
  Filler,
  ChartOptions,
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

interface GraficosDashboardProps {
  isLoading: boolean;
  resumoCategorias: any[];
  resumoMensal: any[];
}

export function GraficosDashboard({
  isLoading,
  resumoCategorias,
  resumoMensal,
}: GraficosDashboardProps) {
  // Preparar dados para gráficos
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
        hoverOffset: 8,
      },
    ],
  };

  const dadosGraficoMensal = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Receitas",
        data: resumoMensal.map((item) => Number(item.receitas)),
        backgroundColor: CORES_GRAFICOS.RECEITA,
        borderColor: CORES_GRAFICOS.RECEITA,
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Despesas",
        data: resumoMensal.map((item) => Number(item.despesas)),
        backgroundColor: CORES_GRAFICOS.DESPESA,
        borderColor: CORES_GRAFICOS.DESPESA,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const dadosGraficoSaldo = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Saldo",
        data: resumoMensal.map((item) => Number(item.saldo)),
        borderColor: CORES_GRAFICOS.SALDO,
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  // Opções para gráficos
  const opcoesPizza: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
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

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatarMoeda(
              context.parsed.y
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatarMoeda(value as number),
        },
      },
    },
  };

  return (
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
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : resumoCategorias.length > 0 ? (
              <div className="h-64">
                <Doughnut data={dadosGraficoCategorias} options={opcoesPizza} />
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
              Receitas vs Despesas - Últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : resumoMensal.length > 0 ? (
              <div className="h-64">
                <Bar data={dadosGraficoMensal} options={opcoesGrafico} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
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
              <LineChart className="w-5 h-5 mr-2" />
              Evolução do Saldo
            </CardTitle>
            <CardDescription>
              Tendência do saldo ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : resumoMensal.length > 0 ? (
              <div className="h-64">
                <Line data={dadosGraficoSaldo} options={opcoesGrafico} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <LineChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Dados insuficientes para o gráfico</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
