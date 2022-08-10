export interface IGenericRepository<Model> {
  findAll(params: any): Promise<Model[]>;
  findOne(params: any): Promise<Model>;
  findById(id: number): Promise<Model | null>;
  create(entity: Model): Promise<Model>;
  update(id: number, entity: Model): Promise<Model>;
  delete(id: number): Promise<number>;
}
