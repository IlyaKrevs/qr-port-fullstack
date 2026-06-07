import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { CatalogService } from "./catalog.service";
import { IProduct } from "@globalShared/types/entities/Product.entity";
import { ApiError } from "@utils/basicApiFncs/ApiError";

// getAll
type GetAllBody = {};
type GetAllResponse = IProduct[];
type GetAllEndpoint = typeof createEndpoint<GetAllBody, GetAllResponse>;

// getById
type GetByIdBody = { id: string };
type GetByIdResponse = IProduct;
type GetByIdParams = { id: string };
type GetByIdEndpoint = typeof createEndpoint<
  GetByIdBody,
  GetByIdResponse,
  GetByIdParams
>;

// addNew
type AddNewBody = IProduct;
type AddNewResponse = { success: boolean };
type AddNewEndpoint = typeof createEndpoint<AddNewBody, AddNewResponse>;

// delete
type DeleteBody = {};
type DeteleResponse = { success: boolean };
type DeleteParams = { id: string };
type DeleteEndpoint = typeof createEndpoint<
  DeleteBody,
  DeteleResponse,
  DeleteParams
>;

interface ICatalogController {
  catalogService: CatalogService;
  authEndpoint: typeof createEndpoint;
  getAll(): ReturnType<GetAllEndpoint>;
  getById(): ReturnType<GetByIdEndpoint>;
  addNew(): ReturnType<AddNewEndpoint>;
  delete(): ReturnType<DeleteEndpoint>;
}

export class CatalogController implements ICatalogController {
  catalogService: CatalogService;
  authEndpoint: typeof createEndpoint;

  constructor(catalogService: CatalogService, authFn: typeof createEndpoint) {
    this.catalogService = catalogService;
    this.authEndpoint = authFn;
  }

  getAll() {
    return this.authEndpoint<GetAllBody, GetAllResponse>(
      async (req, userUniqId) => {
        const products = this.catalogService.getAll();
        return products;
      },
    );
  }

  getById() {
    return this.authEndpoint<GetByIdBody, GetByIdResponse>(
      async (req, userUniqId) => {
        const { id } = req.body;
        const product = this.catalogService.getById(+id);
        if (!product) {
          throw new ApiError(404, "Product not found");
        }
        return product;
      },
    );
  }

  addNew() {
    return this.authEndpoint<AddNewBody, AddNewResponse>(
      async (req, userUniqId) => {
        const newProduct = req.body;

        this.catalogService.addNew(newProduct);
        return { success: true };
      },
    );
  }

  delete() {
    return this.authEndpoint<DeleteBody, DeteleResponse, DeleteParams>(
      async (req, userUniqId) => {
        const { id } = req.params;

        const result = this.catalogService.delete(+id);
        if (!result) {
          throw new ApiError(404, "Product not found");
        }
        return { success: true };
      },
    );
  }
}
