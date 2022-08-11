import { Model, ModelCtor } from "sequelize-typescript";
import { IGenericRepository } from "./interfaces/igeneric.repository";

export abstract class GenericRepository<M extends Model> implements IGenericRepository<M> {
  protected model: ModelCtor<M>;
  constructor(model: ModelCtor<M>) {
    this.model = model;
  }
  findById(id: number): Promise<M | null> {
    return this.model.findByPk(id);
  }
  findAll(params: any = {}): Promise<M[]> {
    return this.model.findAll(params);
  }
  findOne(params: any): Promise<M> {
    return this.model.findOne(params);
  }
  create(entity: M): Promise<M> {
    return entity.save();
  }
  update(id: number, entity: M): Promise<any> {
    return this.model.update(entity, { where: { id } } as any);
  }
  delete(id: number): Promise<number> {
    return this.model.destroy({ where: { id } } as any);
  }
}
