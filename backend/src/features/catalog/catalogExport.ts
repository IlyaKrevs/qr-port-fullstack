import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { CatalogRepository } from "./catalog.repository";
import { CatalogService } from "./catalog.service";
import { CatalogController } from "./catalog.controller";

const repository = new CatalogRepository();
const service = new CatalogService(repository);
export const catalogController = new CatalogController(service, createEndpoint)
