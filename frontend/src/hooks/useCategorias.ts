// src/hooks/useCategorias.ts
import { useState, useCallback, useEffect } from "react";
import { categoriasApi } from "../api";
import {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaFilters,
} from "../types/categoria";

export function useCategorias(filtrosIniciais: CategoriaFilters = {}) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtual, setCategoriaAtual] = useState<Categoria | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<CategoriaFilters>(filtrosIniciais);

  // Buscar categorias quando os filtros mudarem
  useEffect(() => {
    buscarCategorias();
  }, [filtros]);

  // Buscar categorias
  const buscarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoriasApi.listar(filtros);
      setCategorias(data);
    } catch (error: any) {
      setError(error.message || "Erro ao buscar categorias");
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  // Buscar categoria por ID
  const buscarCategoriaPorId = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);

    try {
      const categoria = await categoriasApi.obterPorId(id);
      setCategoriaAtual(categoria);
      return categoria;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar categoria");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar categoria
  const criarCategoria = useCallback(async (categoria: CategoriaCreate) => {
    setIsLoading(true);
    setError(null);

    try {
      const novaCategoria = await categoriasApi.criar(categoria);
      setCategorias((prev) => [...prev, novaCategoria]);
      return novaCategoria;
    } catch (error: any) {
      setError(error.message || "Erro ao criar categoria");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar categoria
  const atualizarCategoria = useCallback(
    async (id: number | string, categoria: CategoriaUpdate) => {
      setIsLoading(true);
      setError(null);

      try {
        const categoriaAtualizada = await categoriasApi.atualizar(
          id,
          categoria
        );
        setCategorias((prev) =>
          prev.map((item) =>
            item.id === Number(id) ? categoriaAtualizada : item
          )
        );
        if (categoriaAtual && categoriaAtual.id === Number(id)) {
          setCategoriaAtual(categoriaAtualizada);
        }
        return categoriaAtualizada;
      } catch (error: any) {
        setError(error.message || "Erro ao atualizar categoria");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [categoriaAtual]
  );

  // Remover categoria
  const removerCategoria = useCallback(
    async (id: number | string) => {
      setIsLoading(true);
      setError(null);

      try {
        await categoriasApi.remover(id);
        setCategorias((prev) => prev.filter((item) => item.id !== Number(id)));
        if (categoriaAtual && categoriaAtual.id === Number(id)) {
          setCategoriaAtual(null);
        }
        return true;
      } catch (error: any) {
        const mensagem =
          error.statusCode === 400 && error.message.includes("padrão")
            ? "Não é possível excluir categorias padrão."
            : error.message || "Erro ao remover categoria";

        setError(mensagem);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [categoriaAtual]
  );

  // Buscar categorias de despesa
  const buscarCategoriasDespesa = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoriasApi.listarCategoriasDespesa();
      return data;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar categorias de despesa");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar categorias de receita
  const buscarCategoriasReceita = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoriasApi.listarCategoriasReceita();
      return data;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar categorias de receita");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar filtros
  const atualizarFiltros = useCallback(
    (novosFiltros: Partial<CategoriaFilters>) => {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        ...novosFiltros,
      }));
    },
    []
  );

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    categorias,
    categoriaAtual,
    isLoading,
    error,
    filtros,
    buscarCategorias,
    buscarCategoriaPorId,
    criarCategoria,
    atualizarCategoria,
    removerCategoria,
    buscarCategoriasDespesa,
    buscarCategoriasReceita,
    atualizarFiltros,
    limparErro,
    setCategoriaAtual,
  };
}
