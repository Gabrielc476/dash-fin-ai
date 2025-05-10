// frontend/src/components/organismos/transacoes/FormularioTransacao/CamposBasicos.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CamposBasicosProps {
  formData: any;
  onChange: (data: any) => void;
}

export function CamposBasicos({ formData, onChange }: CamposBasicosProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          placeholder="Ex: Compra no supermercado"
          required
        />
      </div>

      {/* Valor */}
      <div className="space-y-2">
        <Label htmlFor="amount">Valor *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => onChange({ ...formData, amount: e.target.value })}
          placeholder="0,00"
          required
        />
      </div>

      {/* Data */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="date">Data *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onChange({ ...formData, date: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
