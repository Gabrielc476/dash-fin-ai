// frontend/src/components/organismos/relatorios/GraficoRelatorio/index.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatarMoeda } from "@/utils/formatadores";
import { CORES_GRAFICOS } from "@/constants/format";
import {
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Download,
} from "lucide-react";
import { FormatoExportacao } from "@/types/relatorio";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Definição de tipos de gráficos
type TipoGrafico = "linha" | "barra" | "barraHorizontal" | "pizza" | "rosca";

interface DadosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
    tension?: number;
    borderWidth?: number;
    hoverOffset?: number;
  }[];
}

interface GraficoRelatorioProps {
  titulo: string;
  descricao?: string;
  tiposGraficoDisponiveis?: TipoGrafico[];
  dados: DadosGrafico;
  isLoading?: boolean;
  altura?: number;
  permitirExportar?: boolean;
  onExportar?: (formato: FormatoExportacao) => void;
  formatoDefault?: FormatoExportacao;
  className?: string;
}

export function GraficoRelatorio({
  titulo,
  descricao,
  tiposGraficoDisponiveis = ["linha", "barra", "pizza"],
  dados,
  isLoading = false,
  altura = 300,
  permitirExportar = false,
  onExportar,
  formatoDefault = FormatoExportacao.PDF,
  className = "",
}: GraficoRelatorioProps) {
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>(
    tiposGraficoDisponiveis[0] || "linha"
  );
  const [formatoExportacao, setFormatoExportacao] =
    useState<FormatoExportacao>(formatoDefault);

  // Opções comuns para gráficos
  const opcoesPadrao = {
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
            } else if (
              context.parsed !== null &&
              typeof context.parsed === "number"
            ) {
              label += formatarMoeda(context.parsed);
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

  // Opções para gráfico de pizza
  const opcoesPizza = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 11,
          },
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

  // Opções para gráficos horizontais
  const opcoesBarraHorizontal = {
    ...opcoesPadrao,
    indexAxis: "y" as const,
    plugins: {
      ...opcoesPadrao.plugins,
      legend: {
        display: false,
      },
    },
  };

  // Exibir o gráfico selecionado
  const renderizarGrafico = () => {
    if (isLoading) {
      return <Skeleton className="w-full" style={{ height: altura }} />;
    }

    if (!dados || !dados.labels || dados.labels.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Não há dados para exibir</p>
        </div>
      );
    }

    switch (tipoGrafico) {
      case "linha":
        return (
          <div style={{ height: altura }}>
            <Line data={dados} options={opcoesPadrao} />
          </div>
        );
      case "barra":
        return (
          <div style={{ height: altura }}>
            <Bar data={dados} options={opcoesPadrao} />
          </div>
        );
      case "barraHorizontal":
        return (
          <div style={{ height: altura }}>
            <Bar data={dados} options={opcoesBarraHorizontal} />
          </div>
        );
      case "pizza":
      case "rosca":
        return (
          <div style={{ height: altura }}>
            <Doughnut
              data={dados}
              options={opcoesPizza}
              cutout={tipoGrafico === "rosca" ? "60%" : "0%"}
            />
          </div>
        );
      default:
        return (
          <div style={{ height: altura }}>
            <Line data={dados} options={opcoesPadrao} />
          </div>
        );
    }
  };

  // Ícone para o tipo de gráfico
  const IconeGrafico = ({ tipo }: { tipo: TipoGrafico }) => {
    switch (tipo) {
      case "linha":
        return <LineChart className="w-4 h-4 mr-2" />;
      case "barra":
      case "barraHorizontal":
        return <BarChart3 className="w-4 h-4 mr-2" />;
      case "pizza":
      case "rosca":
        return <PieChart className="w-4 h-4 mr-2" />;
      default:
        return <LineChart className="w-4 h-4 mr-2" />;
    }
  };

  // Label para o tipo de gráfico
  const getLabelTipoGrafico = (tipo: TipoGrafico) => {
    switch (tipo) {
      case "linha":
        return "Linha";
      case "barra":
        return "Barras";
      case "barraHorizontal":
        return "Barras Horizontais";
      case "pizza":
        return "Pizza";
      case "rosca":
        return "Rosca";
      default:
        return tipo;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{titulo}</CardTitle>
            {descricao && <CardDescription>{descricao}</CardDescription>}
          </div>
          {permitirExportar && onExportar && (
            <div className="flex items-center space-x-2">
              <Select
                value={formatoExportacao}
                onValueChange={(value) =>
                  setFormatoExportacao(value as FormatoExportacao)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FormatoExportacao.PDF}>PDF</SelectItem>
                  <SelectItem value={FormatoExportacao.EXCEL}>Excel</SelectItem>
                  <SelectItem value={FormatoExportacao.CSV}>CSV</SelectItem>
                  <SelectItem value={FormatoExportacao.JSON}>JSON</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportar(formatoExportacao)}
              >
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tiposGraficoDisponiveis.length > 1 ? (
          <Tabs
            defaultValue={tipoGrafico}
            onValueChange={(value) => setTipoGrafico(value as TipoGrafico)}
            className="w-full"
          >
            <TabsList className="mb-4">
              {tiposGraficoDisponiveis.map((tipo) => (
                <TabsTrigger
                  key={tipo}
                  value={tipo}
                  className="flex items-center"
                >
                  <IconeGrafico tipo={tipo} />
                  {getLabelTipoGrafico(tipo)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={tipoGrafico}>{renderizarGrafico()}</TabsContent>
          </Tabs>
        ) : (
          renderizarGrafico()
        )}
      </CardContent>
    </Card>
  );
}
