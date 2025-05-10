// frontend/src/components/organismos/transacoes/FiltrosTransacao/index.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Categoria } from "@/types/categoria";
import { Filter } from "lucide-react";

interface FiltrosTransacaoProps {
  filtros: {
    dataInicial: Date;
    dataFinal: Date;
    categoriaSelecionada: number | null;
    tipoTransacao: string;
  };
  onFiltrosChange: (filtros: any) => void;
  onAplicarFiltros: () => void;
  categorias: Categoria[];
}

export function FiltrosTransacao({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  categorias,
}: FiltrosTransacaoProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Data Inicial */}
          <div className="space-y-2">
            <Label htmlFor="dataInicial">Data Inicial</Label>
            <Input
              id="dataInicial"
              type="date"
              value={filtros.dataInicial.toISOString().split("T")[0]}
              onChange={(e) =>
                onFiltrosChange({
                  ...filtros,
                  dataInicial: new Date(e.target.value),
                })
              }
            />
          </div>

          {/* Data Final */}
          <div className="space-y-2">
            <Label htmlFor="dataFinal">Data Final</Label>
            <Input
              id="dataFinal"
              type="date"
              value={filtros.dataFinal.toISOString().split("T")[0]}
              onChange={(e) =>
                onFiltrosChange({
                  ...filtros,
                  dataFinal: new Date(e.target.value),
                })
              }
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={filtros.categoriaSelecionada?.toString()}
              onValueChange={(value) =>
                onFiltrosChange({
                  ...filtros,
                  categoriaSelecionada: value ? parseInt(value) : null,
                })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Todas as categorias</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem
                    key={categoria.id}
                    value={categoria.id.toString()}
                  >
                    {categoria.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={filtros.tipoTransacao}
              onValueChange={(value) =>
                onFiltrosChange({
                  ...filtros,
                  tipoTransacao: value,
                })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="receitas">Receitas</SelectItem>
                <SelectItem value="despesas">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Aplicar */}
          <Button onClick={onAplicarFiltros}>
            <Filter className="w-4 h-4 mr-2" />
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
