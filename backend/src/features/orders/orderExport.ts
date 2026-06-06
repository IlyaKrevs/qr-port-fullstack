import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";

const repository = new OrderRepository();
const service = new OrderService(repository);
export const orderController = new OrderController(service, createEndpoint);
