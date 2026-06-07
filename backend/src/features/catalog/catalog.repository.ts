import { IProduct } from "@globalShared/types/entities/Product.entity";
import { PRODUCTS } from "@mockData/PRODUCTS";

interface ICatalogRepository {
  products: IProduct[];

  getAll(): IProduct[];
  getById(id: IProduct["id"]): IProduct | undefined;

  addNew(product: IProduct): void;
  delete(id: IProduct["id"]): void;
}

export class CatalogRepository implements ICatalogRepository {
  static instance: CatalogRepository;
  products: IProduct[] = [];

  constructor() {
    // ONLY FOR TEST!!!
    this.products = PRODUCTS;
  }

  getAll(): IProduct[] {
    return this.products;
  }

  getById(id: IProduct["id"]): IProduct | undefined {
    const product = this.products.find((i) => i.id === id);
    return product ? { ...product } : undefined;
  }

  addNew(product: IProduct): void {
    this.products.push(product);
  }

  delete(id: IProduct["id"]): void {
    this.products = this.products.filter((i) => i.id !== id);
  }
}
