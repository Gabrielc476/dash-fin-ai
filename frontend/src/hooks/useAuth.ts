"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api";
import { User, LoginRequest, RegisterRequest } from "../types/auth";
import { ROTAS } from "../constants/rotas";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Inicialização - verifica se o usuário está autenticado ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      const isAuthenticated = authApi.isAuthenticated();

      if (isAuthenticated) {
        try {
          const user = await authApi.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Se falhar ao obter usuário, provavelmente o token está inválido
          authApi.logout();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Sessão expirada. Por favor, faça login novamente.",
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Falha no login. Verifique suas credenciais.",
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.register(userData);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error.message ||
          "Falha ao criar conta. Verifique os dados e tente novamente.",
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Aqui usamos o router que foi inicializado no contexto do cliente
    router.push(ROTAS.PUBLIC.LOGIN);
  }, [router]);

  const refreshUserData = useCallback(async () => {
    if (!state.isAuthenticated) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await authApi.getCurrentUser();
      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
      }));
    } catch (error) {
      // Em caso de erro, mantém o usuário atual
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [state.isAuthenticated]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    refreshUserData,
    clearError,
  };
}
