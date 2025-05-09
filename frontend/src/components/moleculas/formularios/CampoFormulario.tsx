// src/componentes/moleculas/formularios/CampoFormulario/index.tsx
import { Label } from "@/components/ui/label";

interface CampoFormularioProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}

export function CampoFormulario({
  id,
  label,
  children,
  error,
  hint,
}: CampoFormularioProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
