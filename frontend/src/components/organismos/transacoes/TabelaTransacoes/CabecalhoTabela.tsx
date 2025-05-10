// frontend/src/components/organismos/transacoes/TabelaTransacoes/CabecalhoTabela.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Transacao } from "@/types/transacao";

interface CabecalhoTabelaProps {
  ordenacao: {
    campo: keyof Transacao;
    direcao: "asc" | "desc";
  };
  onOrdenar: (campo: keyof Transacao) => void;
  todosSelecionados: boolean;
  onSelecionarTodos: () => void;
}

export function CabecalhoTabela({
  ordenacao,
  onOrdenar,
  todosSelecionados,
  onSelecionarTodos,
}: CabecalhoTabelaProps) {
  const renderIconeOrdenacao = (campo: keyof Transacao) => {
    if (ordenacao.campo !== campo) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return ordenacao.direcao === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <thead className="bg-muted/50">
      <tr>
        <th className="p-2 text-left">
          <Checkbox
            checked={todosSelecionados}
            onCheckedChange={onSelecionarTodos}
          />
        </th>
        <th className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOrdenar("date")}
            className="h-auto p-1 font-medium"
          >
            Data {renderIconeOrdenacao("date")}
          </Button>
        </th>
        <th className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOrdenar("description")}
            className="h-auto p-1 font-medium"
          >
            Descrição {renderIconeOrdenacao("description")}
          </Button>
        </th>
        <th className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOrdenar("category")}
            className="h-auto p-1 font-medium"
          >
            Categoria {renderIconeOrdenacao("category")}
          </Button>
        </th>
        <th className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOrdenar("amount")}
            className="h-auto p-1 font-medium text-right"
          >
            Valor {renderIconeOrdenacao("amount")}
          </Button>
        </th>
        <th className="p-2 text-center">Ações</th>
      </tr>
    </thead>
  );
}
