// frontend/src/app/(private)/reports/page.tsx
"use client";

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
import { ROTAS } from "@/constants/rotas";

// Icons
import {
  ArrowRight,
  BarChart3,
  FileText,
  PieChart,
  Download,
  TrendingUp,
} from "lucide-react";

export default function RelatoriosPage() {
  const router = useRouter();

  const tiposRelatorio = [
    {
      id: "receita-despesa",
      titulo: "Receitas vs Despesas",
      descricao:
        "Analise a evolução das suas receitas e despesas ao longo do tempo",
      icone: BarChart3,
      rota: ROTAS.PRIVATE.RELATORIOS.RECEITA_DESPESA,
      cor: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "categoria",
      titulo: "Relatório por Categoria",
      descricao: "Visualize seus gastos distribuídos por categoria",
      icone: PieChart,
      rota: ROTAS.PRIVATE.RELATORIOS.CATEGORIA,
      cor: "bg-purple-500/10 text-purple-500",
    },
    {
      id: "tendencias",
      titulo: "Tendências Financeiras",
      descricao: "Acompanhe tendências e previsões sobre suas finanças",
      icone: TrendingUp,
      rota: ROTAS.PRIVATE.RELATORIOS.TENDENCIAS,
      cor: "bg-green-500/10 text-green-500",
    },
    {
      id: "exportar",
      titulo: "Exportar Dados",
      descricao: "Exporte seus dados financeiros em diferentes formatos",
      icone: Download,
      rota: ROTAS.PRIVATE.RELATORIOS.EXPORTAR,
      cor: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Analise seus dados financeiros com relatórios detalhados
        </p>
      </div>

      {/* Grid de relatórios */}
      <div className="grid gap-6 md:grid-cols-2">
        {tiposRelatorio.map((relatorio) => {
          const Icon = relatorio.icone;
          return (
            <Card key={relatorio.id} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${relatorio.cor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="mt-4">{relatorio.titulo}</CardTitle>
                <CardDescription>{relatorio.descricao}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  className="w-full mt-2"
                  onClick={() => router.push(relatorio.rota)}
                >
                  Ver Relatório
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Relatórios Recentes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Relatórios Recentes
          </CardTitle>
          <CardDescription>
            Relatórios que você visualizou recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-6">
              Os relatórios que você visualizar aparecerão aqui para acesso
              rápido
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
