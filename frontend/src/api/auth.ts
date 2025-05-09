// src/api/auth.ts
import api from "./cliente";
import { ROTAS } from "../constants/rotas";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  User,
} from "../types/auth";

export const authApi = {
  /**
   * Realiza login do usuário
   * @param credentials Credenciais de login (email e senha)
   * @returns Resposta com token e dados do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      ROTAS.API.AUTH.LOGIN,
      credentials
    );

    // Armazenar token e refreshToken no localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);

      // Se houver refreshToken na resposta
      if ("refreshToken" in data) {
        localStorage.setItem("refreshToken", data.refreshToken as string);
      }
    }

    return data;
  },

  /**
   * Registra um novo usuário
   * @param userData Dados do novo usuário
   * @returns Resposta com token e dados do usuário
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      ROTAS.API.AUTH.REGISTRO,
      userData
    );

    // Armazenar token e refreshToken no localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);

      // Se houver refreshToken na resposta
      if ("refreshToken" in data) {
        localStorage.setItem("refreshToken", data.refreshToken as string);
      }
    }

    return data;
  },

  /**
   * Atualiza o token de acesso usando o refreshToken
   * @param refreshTokenData Objeto com refreshToken
   * @returns Resposta com novo token e dados do usuário
   */
  async refreshToken(
    refreshTokenData: RefreshTokenRequest
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      ROTAS.API.AUTH.REFRESH_TOKEN,
      refreshTokenData
    );

    // Armazenar novo token no localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  /**
   * Obtém informações do usuário atual
   * @returns Dados do usuário
   */
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>(ROTAS.API.AUTH.PERFIL);
    return data;
  },

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns Boolean indicando se está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");
    return !!token;
  },
};
