// src/components/organismos/orcamentos/ListaOrcamentos/index.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Edit2, Trash2, BarChart4 } from "lucide-react";
import { formatarMoeda } from "@/utils/formatadores";
import { formatarData } from "@/utils/formatadores";
import { ROTAS } from "@/constants/rotas";
import { Orcamento } from "@/types/orcamento";

// Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ListaOrcamentosProps {
  orcamentos: Orcamento[];
  onDelete: (id: number) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function ListaOrcamentos({
  orcamentos,
  onDelete,
  isLoading,
  error,
}: ListaOrcamentosProps) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");

  // Handle navigation to edit page
  const handleEdit = (id: number) => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.EDITAR(id));
  };

  // Handle navigation to view budget progress
  const handleViewProgress = (id: number) => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.DETALHE(id));
  };

  // Handle budget deletion with confirmation
  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const success = await onDelete(confirmDeleteId);
      if (success) {
        setConfirmDeleteId(null);
      }
    } catch (error: any) {
      setDeleteError(error.message || "Erro ao excluir orçamento");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter budgets based on search term
  const filteredOrcamentos = orcamentos.filter((orcamento) =>
    orcamento.name.toLowerCase().includes(filtro.toLowerCase())
  );

  // Check if budget is active (current date is between start and end dates)
  const isOrcamentoAtivo = (orcamento: Orcamento) => {
    const hoje = new Date();
    const dataInicio = new Date(orcamento.startDate);
    const dataFim = new Date(orcamento.endDate);

    return dataInicio <= hoje && hoje <= dataFim;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Orçamentos</CardTitle>
            <CardDescription>Gerencie seus orçamentos</CardDescription>
          </div>
          <Button
            onClick={() => router.push(ROTAS.PRIVATE.ORCAMENTOS.ADICIONAR)}
            className="shrink-0"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {deleteError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <Input
            placeholder="Buscar orçamento..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredOrcamentos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum orçamento encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categorias</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrcamentos.map((orcamento) => (
                  <TableRow key={orcamento.id}>
                    <TableCell className="font-medium">
                      {orcamento.name}
                    </TableCell>
                    <TableCell>{formatarMoeda(orcamento.amount)}</TableCell>
                    <TableCell>
                      {formatarData(new Date(orcamento.startDate))} a{" "}
                      {formatarData(new Date(orcamento.endDate))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          isOrcamentoAtivo(orcamento) ? "default" : "secondary"
                        }
                      >
                        {isOrcamentoAtivo(orcamento) ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {orcamento.categories?.length
                          ? orcamento.categories
                              .slice(0, 2)
                              .map((categoria) => (
                                <Badge
                                  key={categoria.id}
                                  variant="outline"
                                  className="mr-1"
                                  style={{
                                    backgroundColor: categoria.color + "20",
                                    borderColor: categoria.color,
                                  }}
                                >
                                  {categoria.name}
                                </Badge>
                              ))
                          : "Sem categorias"}
                        {orcamento.categories &&
                          orcamento.categories.length > 2 && (
                            <Badge variant="outline">
                              +{orcamento.categories.length - 2}
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProgress(orcamento.id)}
                          title="Ver progresso"
                        >
                          <BarChart4 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(orcamento.id)}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmDeleteId(orcamento.id)}
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar exclusão</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir o orçamento
                                &quot;{orcamento.name}&quot;? Esta ação não pode
                                ser desfeita.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={isDeleting}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Excluindo..." : "Excluir"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
