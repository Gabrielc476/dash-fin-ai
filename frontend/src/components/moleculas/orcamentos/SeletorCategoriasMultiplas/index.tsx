// src/components/moleculas/orcamentos/SeletorCategoriasMultiplas/index.tsx
import { useEffect, useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { Categoria } from "@/types/categoria";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SeletorCategoriasMultiplasProps {
  categorias: Categoria[];
  selecionadas: number[];
  onChange: (categoriaIds: number[]) => void;
  disabled?: boolean;
}

export function SeletorCategoriasMultiplas({
  categorias,
  selecionadas,
  onChange,
  disabled = false,
}: SeletorCategoriasMultiplasProps) {
  const [open, setOpen] = useState(false);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<
    Categoria[]
  >([]);
  const [categoriasSelecionadasObj, setCategoriasSelecionadasObj] = useState<
    Categoria[]
  >([]);

  // Initialize available and selected categories
  useEffect(() => {
    const selecionadasObj = categorias.filter((cat) =>
      selecionadas.includes(cat.id)
    );
    setCategoriasSelecionadasObj(selecionadasObj);

    const disponiveis = categorias.filter(
      (cat) => !selecionadas.includes(cat.id)
    );
    setCategoriasDisponiveis(disponiveis);
  }, [categorias, selecionadas]);

  // Add a category to selected
  const adicionarCategoria = (categoria: Categoria) => {
    if (disabled) return;

    const novasSelecionadas = [...selecionadas, categoria.id];
    onChange(novasSelecionadas);

    // Update local state
    setCategoriasSelecionadasObj([...categoriasSelecionadasObj, categoria]);
    setCategoriasDisponiveis(
      categoriasDisponiveis.filter((cat) => cat.id !== categoria.id)
    );

    setOpen(false);
  };

  // Remove a category from selected
  const removerCategoria = (id: number) => {
    if (disabled) return;

    const novasSelecionadas = selecionadas.filter((catId) => catId !== id);
    onChange(novasSelecionadas);

    // Update local state
    const categoriaRemovida = categoriasSelecionadasObj.find(
      (cat) => cat.id === id
    );
    if (categoriaRemovida) {
      setCategoriasSelecionadasObj(
        categoriasSelecionadasObj.filter((cat) => cat.id !== id)
      );
      setCategoriasDisponiveis([...categoriasDisponiveis, categoriaRemovida]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
        {categoriasSelecionadasObj.length === 0 ? (
          <div className="text-sm text-muted-foreground p-1">
            Nenhuma categoria selecionada
          </div>
        ) : (
          categoriasSelecionadasObj.map((categoria) => (
            <Badge
              key={categoria.id}
              variant="secondary"
              className="flex items-center gap-1"
              style={{
                backgroundColor: `${categoria.color}20`,
                borderColor: categoria.color,
              }}
            >
              {categoria.name}
              <button
                type="button"
                onClick={() => removerCategoria(categoria.id)}
                disabled={disabled}
                className="ml-1 rounded-full hover:bg-accent/50 focus:outline-none"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">
                  Remover categoria {categoria.name}
                </span>
              </button>
            </Badge>
          ))
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="flex items-center justify-between w-full"
            disabled={disabled || categoriasDisponiveis.length === 0}
          >
            <span>
              {categoriasDisponiveis.length === 0
                ? "Todas as categorias selecionadas"
                : "Adicionar categoria"}
            </span>
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar categoria..." />
            <CommandList>
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                {categoriasDisponiveis.map((categoria) => (
                  <CommandItem
                    key={categoria.id}
                    value={categoria.name}
                    onSelect={() => adicionarCategoria(categoria)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoria.color }}
                      />
                      <span>{categoria.name}</span>
                    </div>
                    <Check
                      className={`ml-auto h-4 w-4 opacity-0 transition-opacity`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
