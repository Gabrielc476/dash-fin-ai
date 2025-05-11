// frontend/src/components/organismos/relatorios/SeletorPeriodo/index.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { obterPeriodo } from "@/utils/data";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

export type PeriodoOption =
  | "hoje"
  | "semana"
  | "mes"
  | "trimestre"
  | "ano"
  | "ultimos30"
  | "ultimos90"
  | "custom";

interface SeletorPeriodoProps {
  periodo: PeriodoOption;
  dataInicial: Date;
  dataFinal: Date;
  onChange: (
    periodo: PeriodoOption,
    dataInicial: Date,
    dataFinal: Date
  ) => void;
  className?: string;
}

export function SeletorPeriodo({
  periodo,
  dataInicial,
  dataFinal,
  onChange,
  className = "",
}: SeletorPeriodoProps) {
  // Atualizar datas quando o período muda
  const handlePeriodoChange = (novoPeriodo: PeriodoOption) => {
    if (novoPeriodo !== "custom") {
      const { inicio, fim } = obterPeriodo(novoPeriodo);
      onChange(novoPeriodo, inicio, fim);
    } else {
      onChange(novoPeriodo, dataInicial, dataFinal);
    }
  };

  // Atualizar data inicial
  const handleDataInicialChange = (novaData: string) => {
    const data = new Date(novaData);
    onChange("custom", data, dataFinal);
  };

  // Atualizar data final
  const handleDataFinalChange = (novaData: string) => {
    const data = new Date(novaData);
    onChange("custom", dataInicial, data);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Período</label>
        <Select value={periodo} onValueChange={handlePeriodoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="semana">Esta Semana</SelectItem>
            <SelectItem value="mes">Este Mês</SelectItem>
            <SelectItem value="trimestre">Este Trimestre</SelectItem>
            <SelectItem value="ano">Este Ano</SelectItem>
            <SelectItem value="ultimos30">Últimos 30 dias</SelectItem>
            <SelectItem value="ultimos90">Últimos 90 dias</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {periodo === "custom" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Intervalo de Datas</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                className="w-full h-10 px-3 py-2 border rounded-md"
                value={format(dataInicial, "yyyy-MM-dd")}
                onChange={(e) => handleDataInicialChange(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <span className="text-muted-foreground">até</span>
            <div className="relative flex-1">
              <input
                type="date"
                className="w-full h-10 px-3 py-2 border rounded-md"
                value={format(dataFinal, "yyyy-MM-dd")}
                onChange={(e) => handleDataFinalChange(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {`Período: ${format(dataInicial, "dd/MM/yyyy", {
          locale: ptBR,
        })} até ${format(dataFinal, "dd/MM/yyyy", { locale: ptBR })}`}
      </div>
    </div>
  );
}
