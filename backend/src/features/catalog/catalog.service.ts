import { IProduct } from "@globalShared/types/entities/Product.entity";
import { CatalogRepository } from "./catalog.repository";

interface ICatalogService {
  catalogRepository: CatalogRepository;

  getAll(): IProduct[];
  getById(id: IProduct["id"]): IProduct | undefined;
  addNew(product: IProduct): void;
  delete(id: IProduct["id"]): boolean;
}

export class CatalogService implements ICatalogService {
  catalogRepository: CatalogRepository;

  constructor(catalogRep: CatalogRepository) {
    this.catalogRepository = catalogRep;
  }

  getAll(): IProduct[] {
    return this.catalogRepository.getAll();
  }

  getById(id: IProduct["id"]): IProduct | undefined {
    return this.catalogRepository.getById(id);
  }

  addNew(product: IProduct): void {
    this.catalogRepository.addNew(product);
  }

  delete(id: IProduct["id"]): boolean {
    const product = this.getById(id);
    if (product) {
      this.catalogRepository.delete(id);
      return true;
    }
    return false;
  }
}
