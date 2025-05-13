"use client";

// Component to display and filter a list of insights
import { useIaInsights } from "@/hooks";
import { Insight, TipoInsight } from "@/types";
import { useState, useEffect } from "react";
import { InsightCard } from "../InsightCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RefreshCw, Filter, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsListProps {
  limit?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export function InsightsList({
  limit = 10,
  showFilters = true,
  compact = false,
}: InsightsListProps) {
  const {
    insights,
    isLoading,
    error,
    filtros,
    buscarInsights,
    atualizarFiltros,
    limparErro,
  } = useIaInsights();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>([]);

  // Apply filters and search
  useEffect(() => {
    if (!insights) return;

    let filtered = [...insights];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (insight) =>
          insight.title.toLowerCase().includes(term) ||
          insight.description.toLowerCase().includes(term)
      );
    }

    // Limit results
    if (limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredInsights(filtered);
  }, [insights, searchTerm, limit]);

  // Initial load
  useEffect(() => {
    buscarInsights();
  }, [buscarInsights]);

  const handleTypeChange = (value: string) => {
    atualizarFiltros({
      type: value === "all" ? undefined : (value as TipoInsight),
    });
  };

  const handleRelevanceChange = (value: number[]) => {
    atualizarFiltros({ minRelevance: value[0] });
  };

  const handleRefresh = () => {
    limparErro();
    buscarInsights();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-medium">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type filter */}
            <Select
              value={filtros.type || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de insight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value={TipoInsight.PADRAO_GASTO}>
                  Padrão de Gasto
                </SelectItem>
                <SelectItem value={TipoInsight.OPORTUNIDADE_ECONOMIA}>
                  Oportunidade de Economia
                </SelectItem>
                <SelectItem value={TipoInsight.DETECCAO_ANOMALIA}>
                  Anomalia Detectada
                </SelectItem>
                <SelectItem value={TipoInsight.RECOMENDACAO_ORCAMENTO}>
                  Recomendação de Orçamento
                </SelectItem>
                <SelectItem value={TipoInsight.TENDENCIA}>Tendência</SelectItem>
                <SelectItem value={TipoInsight.INFORMATIVO}>
                  Informativo
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Relevance filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Relevância mínima</Label>
                <span className="text-sm font-medium">
                  {filtros.minRelevance || 0}
                </span>
              </div>
              <Slider
                defaultValue={[filtros.minRelevance || 0]}
                max={10}
                step={1}
                onValueChange={handleRelevanceChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={limparErro}
            className="mt-2"
          >
            Fechar
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Insights grid */}
      {!isLoading && (
        <>
          {filteredInsights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum insight encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  compact={compact}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
