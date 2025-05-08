// src/repositories/user.repository.ts
import User from "../models/user.model";
import { UserCreateDto, UserUpdateDto } from "../types/models";
import { security } from "../utils/security";

class UserRepository {
  /**
   * Cria um novo usuário
   */
  async create(userData: UserCreateDto): Promise<User> {
    // Não fazemos hash da senha aqui, esperamos que o security.hashPassword
    // já tenha sido chamado no serviço que usa este repositório
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password, // Aqui já deve ser o hash
      settings: {},
    });

    return user;
  }

  /**
   * Obtém um usuário por ID
   */
  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  /**
   * Obtém um usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: number, data: Partial<User>): Promise<User | null> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    // Atualizar o usuário
    await user.update(data);

    // Recarregar o usuário
    return this.findById(id);
  }

  /**
   * Remove um usuário
   */
  async delete(id: number): Promise<boolean> {
    const result = await User.destroy({
      where: { id },
    });

    return result > 0;
  }

  /**
   * Cria categorias padrão para um novo usuário
   */
  async createDefaultCategories(userId: number): Promise<void> {
    // Este método seria implementado para criar categorias padrão
    // após o registro do usuário, conforme mencionado na documentação
    // Implementation aqui chamaria o categoryRepository
  }
}

export default new UserRepository();
