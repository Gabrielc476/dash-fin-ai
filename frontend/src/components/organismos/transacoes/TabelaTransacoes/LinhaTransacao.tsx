// frontend/src/components/organismos/transacoes/TabelaTransacoes/LinhaTransacao.tsx
import { Transacao } from "@/types/transacao";
import { formatarMoeda, formatarData } from "@/utils/formatadores";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LinhaTransacaoProps {
  transacao: Transacao;
  isSelected: boolean;
  onSelecionar: () => void;
  onEditar: (id: number) => void;
  onDetalhar: (id: number) => void;
  onExcluir: (id: number) => void;
}

export function LinhaTransacao({
  transacao,
  isSelected,
  onSelecionar,
  onEditar,
  onDetalhar,
  onExcluir,
}: LinhaTransacaoProps) {
  return (
    <tr className="border-b hover:bg-muted/30 transition-colors">
      <td className="p-2">
        <Checkbox checked={isSelected} onCheckedChange={onSelecionar} />
      </td>
      <td className="p-2 text-sm">
        {formatarData(new Date(transacao.date), "dd/MM/yyyy")}
      </td>
      <td className="p-2">
        <div className="flex flex-col">
          <span className="font-medium text-sm">{transacao.description}</span>
          {transacao.notes && (
            <span className="text-xs text-muted-foreground">
              {transacao.notes}
            </span>
          )}
        </div>
      </td>
      <td className="p-2">
        <Badge
          variant="secondary"
          style={{
            backgroundColor: transacao.category?.color + "20",
            borderColor: transacao.category?.color,
            color: transacao.category?.color,
          }}
        >
          {transacao.category?.name || "Sem categoria"}
        </Badge>
      </td>
      <td className="p-2 text-right">
        <span
          className={`font-medium ${
            transacao.isExpense ? "text-red-600" : "text-green-600"
          }`}
        >
          {transacao.isExpense ? "-" : "+"}
          {formatarMoeda(transacao.amount)}
        </span>
      </td>
      <td className="p-2 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDetalhar(transacao.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditar(transacao.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExcluir(transacao.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
