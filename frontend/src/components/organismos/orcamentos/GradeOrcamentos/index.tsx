// src/components/organismos/orcamentos/GradeOrcamentos/index.tsx
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  BarChart3,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { formatarMoeda } from "@/utils/formatadores";
import { formatarData } from "@/utils/formatadores";
import { ROTAS } from "@/constants/rotas";

// Types
interface OrcamentoComProgressoProps {
  id: number;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  categories?: { id: number; name: string; color: string }[];
  progresso: {
    percentualGasto: number;
    valorGasto: number;
    valorRestante: number;
    situacao: "normal" | "atencao" | "excedido";
  };
}

interface GradeOrcamentosProps {
  orcamentos: OrcamentoComProgressoProps[];
  isLoading?: boolean;
  mostrarAdicionarNovo?: boolean;
}

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BarraProgresso } from "@/components/moleculas/orcamentos/BarraProgresso";
import { Badge } from "@/components/ui/badge";

export function GradeOrcamentos({
  orcamentos,
  isLoading = false,
  mostrarAdicionarNovo = true,
}: GradeOrcamentosProps) {
  const router = useRouter();

  // Navigate to budget detail
  const verOrcamento = (id: number) => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.DETALHE(id));
  };

  // Navigate to create budget
  const adicionarOrcamento = () => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.ADICIONAR);
  };

  // Get status icon based on budget situation
  const obterIconeSituacao = (situacao: string) => {
    switch (situacao) {
      case "excedido":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "atencao":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "normal":
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  // Get color class based on budget situation
  const obterCorSituacao = (situacao: string) => {
    switch (situacao) {
      case "excedido":
        return "border-destructive bg-destructive/5";
      case "atencao":
        return "border-amber-500 bg-amber-500/5";
      case "normal":
        return "border-primary bg-primary/5";
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        // Loading placeholders
        Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 w-3/4 bg-muted rounded mb-4"></div>
                <div className="h-4 w-full bg-muted rounded mb-6"></div>
                <div className="h-4 w-full bg-muted rounded-full mb-3"></div>
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-4 w-20 bg-muted rounded"></div>
                </div>
                <div className="flex flex-wrap gap-1 mt-4">
                  <div className="h-6 w-20 bg-muted rounded"></div>
                  <div className="h-6 w-24 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
      ) : (
        <>
          {/* Add new budget card */}
          {mostrarAdicionarNovo && (
            <Card
              className="border-dashed hover:border-primary hover:cursor-pointer transition-colors"
              onClick={adicionarOrcamento}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[220px] text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Novo Orçamento</h3>
                <p className="text-muted-foreground text-sm">
                  Crie um novo orçamento para suas categorias de despesas
                </p>
              </CardContent>
            </Card>
          )}

          {/* Budget cards */}
          {orcamentos.map((orcamento) => (
            <Card
              key={orcamento.id}
              className={`hover:shadow-md transition-shadow ${obterCorSituacao(
                orcamento.progresso.situacao
              )}`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {orcamento.name}
                  </h3>
                  {obterIconeSituacao(orcamento.progresso.situacao)}
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold mb-1">
                    {formatarMoeda(orcamento.amount)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    {formatarData(new Date(orcamento.startDate))} a{" "}
                    {formatarData(new Date(orcamento.endDate))}
                  </div>
                </div>

                <div className="space-y-2">
                  <BarraProgresso
                    percentual={orcamento.progresso.percentualGasto}
                    altura="h-3"
                    mostrarTexto={false}
                  />
                  <div className="flex justify-between text-sm">
                    <span>
                      {Math.min(
                        100,
                        Math.round(orcamento.progresso.percentualGasto)
                      )}
                      %
                    </span>
                    <span>
                      {formatarMoeda(orcamento.progresso.valorGasto)} /{" "}
                      {formatarMoeda(orcamento.amount)}
                    </span>
                  </div>
                </div>

                {orcamento.categories && orcamento.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {orcamento.categories.slice(0, 3).map((categoria) => (
                      <Badge
                        key={categoria.id}
                        variant="outline"
                        style={{
                          backgroundColor: `${categoria.color}20`,
                          borderColor: categoria.color,
                        }}
                      >
                        {categoria.name}
                      </Badge>
                    ))}
                    {orcamento.categories.length > 3 && (
                      <Badge variant="outline">
                        +{orcamento.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => verOrcamento(orcamento.id)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Progresso
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Empty state */}
          {orcamentos.length === 0 && !mostrarAdicionarNovo && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                Nenhum orçamento encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não tem orçamentos cadastrados
              </p>
              <Button onClick={adicionarOrcamento}>
                <Plus className="h-4 w-4 mr-2" />
                Criar meu primeiro orçamento
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
