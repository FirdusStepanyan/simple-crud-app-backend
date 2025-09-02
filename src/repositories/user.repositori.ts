import AppDataSource from "../database";
import UserSchema, { User } from "../models/user.model";

export class UserRepository {
  private repo = AppDataSource.getRepository<User>(UserSchema);

  async findAll(skip: number, take: number) {
    return this.repo.findAndCount({ relations: ["products"], skip, take });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["products"] });
  }

  async findByIdWithoutRelations(id: number) {
    return this.repo.findOneBy({ id });
  }

  async save(user: User) {
    return this.repo.save(user);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
