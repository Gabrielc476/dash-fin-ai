// frontend/src/components/organismos/transacoes/FormularioTransacao/CamposOpcionais.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  METODOS_PAGAMENTO,
  LABELS_METODOS_PAGAMENTO,
} from "@/constants/categorias";

interface CamposOpcionaisProps {
  formData: any;
  onChange: (data: any) => void;
}

export function CamposOpcionais({ formData, onChange }: CamposOpcionaisProps) {
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    onChange({ ...formData, tags });
  };

  return (
    <div className="space-y-4">
      {/* Método de Pagamento */}
      <div className="space-y-2">
        <Label>Método de Pagamento</Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) =>
            onChange({ ...formData, paymentMethod: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um método" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(METODOS_PAGAMENTO).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {LABELS_METODOS_PAGAMENTO[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <Input
          value={formData.tags.join(", ")}
          onChange={handleTagsChange}
          placeholder="Ex: trabalho, viagem, emergência"
        />
        <p className="text-xs text-muted-foreground">
          Separe as tags com vírgulas
        </p>
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => onChange({ ...formData, notes: e.target.value })}
          placeholder="Informações adicionais sobre esta transação"
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
