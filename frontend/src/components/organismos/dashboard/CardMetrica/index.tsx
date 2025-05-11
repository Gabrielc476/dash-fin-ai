// frontend/src/components/organismos/dashboard/CardMetrica/index.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from "@/utils/formatadores";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

interface CardMetricaProps {
  titulo: string;
  valor: number | string;
  icone: any;
  cor: string;
  tendencia?: { porcentagem: number; positiva: boolean };
  descricao?: string;
  link?: string;
  onNavegar?: (rota: string) => void;
}

export function CardMetrica({
  titulo,
  valor,
  icone: IconComponent,
  cor,
  tendencia,
  descricao,
  link,
  onNavegar,
}: CardMetricaProps) {
  const handleNavegar = () => {
    if (onNavegar && link) {
      onNavegar(link);
    }
  };

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
            <IconComponent className={`w-6 h-6 ${cor}`} />
          </div>
        </div>
      </CardContent>
      {link && (
        <CardFooter className="p-3 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8"
            onClick={handleNavegar}
          >
            Ver detalhes
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
