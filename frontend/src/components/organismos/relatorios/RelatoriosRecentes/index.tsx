// frontend/src/components/organismos/relatorios/RelatoriosRecentes/index.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ROTAS } from "@/constants/rotas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Clock,
  Star,
  BarChart3,
  PieChart,
  TrendingUp,
  ArrowRight,
  FileText,
  StarOff,
  FileUp,
} from "lucide-react";

// Tipo para os relatórios
interface Relatorio {
  id: string;
  titulo: string;
  tipo:
    | "receita-despesa"
    | "categoria"
    | "tendencias"
    | "exportacao"
    | "personalizado";
  rota: string;
  dataCriacao: Date;
  favorito: boolean;
  descricao?: string;
  parametros?: Record<string, any>;
}

interface RelatoriosRecentesProps {
  relatorios: Relatorio[];
  isLoading?: boolean;
  onToggleFavorito?: (id: string, favorito: boolean) => void;
  onRemover?: (id: string) => void;
  onAbrir?: (relatorio: Relatorio) => void;
  className?: string;
}

export function RelatoriosRecentes({
  relatorios,
  isLoading = false,
  onToggleFavorito,
  onRemover,
  onAbrir,
  className = "",
}: RelatoriosRecentesProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"recentes" | "favoritos">("recentes");

  // Filtrar relatórios por favoritos ou recentes
  const relatoriosFiltrados =
    tab === "favoritos"
      ? relatorios.filter((rel) => rel.favorito)
      : [...relatorios]
          .sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime())
          .slice(0, 5);

  // Função para abrir um relatório
  const handleAbrirRelatorio = (relatorio: Relatorio) => {
    if (onAbrir) {
      onAbrir(relatorio);
    } else {
      router.push(relatorio.rota);
    }
  };

  // Ícone para o tipo de relatório
  const IconeRelatorio = ({ tipo }: { tipo: Relatorio["tipo"] }) => {
    switch (tipo) {
      case "receita-despesa":
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case "categoria":
        return <PieChart className="w-4 h-4 text-purple-600" />;
      case "tendencias":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "exportacao":
        return <FileUp className="w-4 h-4 text-orange-600" />;
      case "personalizado":
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  // Renderizar cada item de relatório
  const renderizarRelatorio = (relatorio: Relatorio) => (
    <div
      key={relatorio.id}
      className="group border rounded-md p-3 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => handleAbrirRelatorio(relatorio)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <IconeRelatorio tipo={relatorio.tipo} />
          </div>
          <div>
            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
              {relatorio.titulo}
            </h4>
            {relatorio.descricao && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {relatorio.descricao}
              </p>
            )}
            <div className="flex items-center mt-1 gap-2">
              <Badge variant="outline" className="text-xs">
                {(() => {
                  switch (relatorio.tipo) {
                    case "receita-despesa":
                      return "Receitas vs Despesas";
                    case "categoria":
                      return "Categorias";
                    case "tendencias":
                      return "Tendências";
                    case "exportacao":
                      return "Exportação";
                    case "personalizado":
                      return "Personalizado";
                    default:
                      return relatorio.tipo;
                  }
                })()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {format(relatorio.dataCriacao, "dd MMM yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {onToggleFavorito && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorito(relatorio.id, !relatorio.favorito);
              }}
            >
              {relatorio.favorito ? (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Relatórios Recentes
        </CardTitle>
        <CardDescription>
          Acesse rapidamente relatórios visualizados recentemente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(value) => setTab(value as any)}>
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="recentes" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Recentes
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recentes">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : relatoriosFiltrados.length > 0 ? (
              <div className="space-y-3">
                {relatoriosFiltrados.map(renderizarRelatorio)}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum relatório visualizado recentemente</p>
                <Button
                  variant="link"
                  onClick={() => router.push(ROTAS.PRIVATE.RELATORIOS.INICIO)}
                >
                  Explorar relatórios disponíveis
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favoritos">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : relatoriosFiltrados.length > 0 ? (
              <div className="space-y-3">
                {relatoriosFiltrados.map(renderizarRelatorio)}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum relatório marcado como favorito</p>
                <p className="text-sm mt-1">
                  Marque seus relatórios frequentes como favoritos para acesso
                  rápido
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
