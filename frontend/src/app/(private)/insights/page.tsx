"use client";

// Page component for Insights listing
import { Metadata } from "next";
import { useIaInsights } from "@/hooks";
import { InsightsList } from "@/components/organismos/insights/InsightsList";
import { InsightGenerator } from "@/components/organismos/insights/InsightGenerator";
import { Sparkles, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights Financeiros",
  description:
    "Insights inteligentes gerados por IA para melhorar sua saúde financeira",
};

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          Insights Financeiros
        </h1>
        <p className="text-muted-foreground">
          Descubra recomendações inteligentes para melhorar sua saúde financeira
          geradas pelo Claude 3.7
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - Insights list */}
        <div className="md:col-span-2">
          <InsightsList />
        </div>

        {/* Sidebar - Insight generator and stats */}
        <div className="space-y-6">
          <InsightGenerator
            onSuccess={() => {
              // This will refresh the insights list after generation
              window.location.reload();
            }}
          />

          <div className="bg-muted/30 rounded-lg p-4 border">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Como funciona
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                O Claude 3.7 analisa seus dados financeiros para identificar
                padrões, anomalias e oportunidades para economizar dinheiro.
              </p>
              <p>
                Os insights são baseados nas suas transações, orçamentos e
                categorias, trazendo recomendações personalizadas para melhorar
                sua saúde financeira.
              </p>
              <p>
                Clique em "Gerar Novos Insights" para obter análises atualizadas
                com base nos seus dados mais recentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
