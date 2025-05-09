// src/api/cliente.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ROTAS } from "../constants/rotas";

// Criar instância do axios com configurações padrão
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ROTAS.API.BASE,
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor para tratamento de erros de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Evitar loop infinito em caso de erro no refresh token
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Se o erro for 401 (não autorizado) e não estivermos tentando fazer login
    if (
      error.response?.status === 401 &&
      !originalRequest?.url?.includes("/auth/login") &&
      !originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const { data } = await api.post(ROTAS.API.AUTH.REFRESH_TOKEN, {
            refreshToken,
          });

          if (data.token) {
            // Salvar novo token
            localStorage.setItem("token", data.token);

            // Atualizar o header na requisição original e tentar novamente
            originalRequest.headers.set(
              "Authorization",
              `Bearer ${data.token}`
            );
            return api(originalRequest);
          }
        }

        // Se não conseguir atualizar o token, fazer logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Redirecionar para login
        if (typeof window !== "undefined") {
          window.location.href = ROTAS.PUBLIC.LOGIN;
        }
      } catch (refreshError) {
        console.error("Erro ao atualizar token:", refreshError);

        // Fazer logout em caso de erro
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Redirecionar para login
        if (typeof window !== "undefined") {
          window.location.href = ROTAS.PUBLIC.LOGIN;
        }
      }
    }

    // Tratamento geral de erros
    const errorMessage =
      error.response?.data?.message || "Ocorreu um erro na requisição";

    // Retornar erro para tratamento específico no componente
    return Promise.reject({
      ...error,
      message: errorMessage,
      statusCode: error.response?.status,
    });
  }
);

export default api;
