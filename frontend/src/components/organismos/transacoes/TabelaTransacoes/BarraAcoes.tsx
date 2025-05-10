// frontend/src/components/organismos/transacoes/TabelaTransacoes/BarraAcoes.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, X } from "lucide-react";

interface BarraAcoesProps {
  quantidadeSelecionada: number;
  onExcluirSelecionadas: () => void;
  onDesselecionar: () => void;
}

export function BarraAcoes({
  quantidadeSelecionada,
  onExcluirSelecionadas,
  onDesselecionar,
}: BarraAcoesProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {quantidadeSelecionada} selecionada
          {quantidadeSelecionada > 1 ? "s" : ""}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onDesselecionar}>
          <X className="w-4 h-4 mr-1" />
          Desselecionar
        </Button>
      </div>
      <Button variant="destructive" size="sm" onClick={onExcluirSelecionadas}>
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir selecionadas
      </Button>
    </div>
  );
}
