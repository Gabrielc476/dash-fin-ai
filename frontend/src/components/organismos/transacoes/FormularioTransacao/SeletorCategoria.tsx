// frontend/src/components/organismos/transacoes/FormularioTransacao/SeletorCategoria.tsx
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Categoria } from "@/types/categoria";

interface SeletorCategoriaProps {
  categorias: Categoria[];
  categoriaSelecionada: string;
  isExpense: boolean;
  onCategoriaChange: (categoryId: string) => void;
  onTipoChange: (isExpense: boolean) => void;
}

export function SeletorCategoria({
  categorias,
  categoriaSelecionada,
  isExpense,
  onCategoriaChange,
  onTipoChange,
}: SeletorCategoriaProps) {
  return (
    <div className="space-y-4">
      {/* Tipo de Transação */}
      <div className="space-y-2">
        <Label>Tipo de Transação *</Label>
        <RadioGroup
          value={isExpense.toString()}
          onValueChange={(value) => onTipoChange(value === "true")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="despesa" />
            <Label htmlFor="despesa">Despesa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="receita" />
            <Label htmlFor="receita">Receita</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label>Categoria *</Label>
        <Select value={categoriaSelecionada} onValueChange={onCategoriaChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoria.color }}
                  />
                  {categoria.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
