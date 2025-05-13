"use client";

// Component to generate new AI insights
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIaInsights } from "@/hooks";
import { useState } from "react";
import { Brain, Sparkles, Loader, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { INFO } from "@/constants/mensagens";

interface InsightGeneratorProps {
  onSuccess?: () => void;
}

export function InsightGenerator({ onSuccess }: InsightGeneratorProps) {
  const { gerarInsights, isLoading, error } = useIaInsights();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setSuccess(false);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    try {
      const result = await gerarInsights();
      setProgress(100);
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 3000);
    } catch (err) {
      console.error("Error generating insights:", err);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Success overlay */}
      {success && (
        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center z-10 flex-col">
          <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
          <p className="font-medium text-green-700">
            Insights gerados com sucesso!
          </p>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Gerador de Insights de IA
        </CardTitle>
        <CardDescription>
          Gere novos insights com Claude 3.7 para obter recomendações
          personalizadas com base nos seus dados financeiros
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium mb-1">
                Análise avançada dos seus dados financeiros
              </p>
              <p className="text-sm text-muted-foreground">
                O Claude 3.7 analisará seus dados financeiros para identificar
                padrões, anomalias e oportunidades de economia, gerando insights
                personalizados para ajudar a melhorar sua saúde financeira.
              </p>
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              {INFO.GERANDO_INSIGHTS}
            </p>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isLoading || isGenerating}
        >
          {isLoading || isGenerating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Gerando insights...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Novos Insights
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
