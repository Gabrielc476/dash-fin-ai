// src/api/categorias.ts
import api from "./cliente";
import { ROTAS } from "../constants/rotas";
import {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaFilters,
} from "../types/categoria";

export const categoriasApi = {
  /**
   * Lista categorias com filtros opcionais
   * @param filtros Filtros para a listagem
   * @returns Lista de categorias
   */
  async listar(filtros: CategoriaFilters = {}): Promise<Categoria[]> {
    const { data } = await api.get<Categoria[]>(ROTAS.API.CATEGORIAS.BASE, {
      params: filtros,
    });

    return data;
  },

  /**
   * Obtém uma categoria por ID
   * @param id ID da categoria
   * @returns Detalhes da categoria
   */
  async obterPorId(id: number | string): Promise<Categoria> {
    const { data } = await api.get<Categoria>(ROTAS.API.CATEGORIAS.POR_ID(id));
    return data;
  },

  /**
   * Cria uma nova categoria
   * @param categoria Dados da nova categoria
   * @returns Categoria criada
   */
  async criar(categoria: CategoriaCreate): Promise<Categoria> {
    const { data } = await api.post<Categoria>(
      ROTAS.API.CATEGORIAS.BASE,
      categoria
    );
    return data;
  },

  /**
   * Atualiza uma categoria existente
   * @param id ID da categoria
   * @param categoria Dados para atualização
   * @returns Categoria atualizada
   */
  async atualizar(
    id: number | string,
    categoria: CategoriaUpdate
  ): Promise<Categoria> {
    const { data } = await api.put<Categoria>(
      ROTAS.API.CATEGORIAS.POR_ID(id),
      categoria
    );
    return data;
  },

  /**
   * Remove uma categoria
   * @param id ID da categoria
   * @returns void
   */
  async remover(id: number | string): Promise<void> {
    await api.delete(ROTAS.API.CATEGORIAS.POR_ID(id));
  },

  /**
   * Lista apenas categorias de despesa
   * @returns Lista de categorias de despesa
   */
  async listarCategoriasDespesa(): Promise<Categoria[]> {
    return this.listar({ onlyExpense: true });
  },

  /**
   * Lista apenas categorias de receita
   * @returns Lista de categorias de receita
   */
  async listarCategoriasReceita(): Promise<Categoria[]> {
    return this.listar({ onlyIncome: true });
  },
};
