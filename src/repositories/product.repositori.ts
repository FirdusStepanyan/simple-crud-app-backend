import AppDataSource from "../database";
import ProductSchema, { Product } from "../models/product.model";
import { Repository } from "typeorm";

export class ProductRepository {
  private repo: Repository<Product>;

  constructor() {
    this.repo = AppDataSource.getRepository<Product>(ProductSchema);
  }

  async findAll(skip: number, take: number, whereCondition: object = {}, order: "ASC" | "DESC" = "ASC") {
    return this.repo.findAndCount({
      where: whereCondition,
      relations: ["user"],
      order: { id: order },
      skip,
      take,
    });
  }

  async findById(id: number, userId?: number) {
    return this.repo.findOne({
      where: userId ? { id, user: { id: userId } } : { id },
      relations: ["user"],
    });
  }

  async save(product: Product) {
    return this.repo.save(product);
  }

  async create(data: Partial<Product>) {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async update(product: Product) {
    return this.repo.save(product);
  }

  async delete(product: Product) {
    return this.repo.remove(product);
  }
}