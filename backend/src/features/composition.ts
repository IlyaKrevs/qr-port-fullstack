import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { ConnectionsRepository } from "./connections/connections.repository";
import { ConnectionService } from "./connections/connections.service";
import { QrPortRepository } from "./qrports/qrport.repository";
import { QrPortService } from "./qrports/qrport.service";
import { SessionController } from "./session/session.controller";
import { SessionRepository } from "./session/session.repository";
import { SessionService } from "./session/session.service";
import { QrPortController } from "./qrports/qrport.controller";
import { OrderRepository } from "./orders/order.repository";
import { CatalogRepository } from "./catalog/catalog.repository";
import { OrderService } from "./orders/order.service";
import { CatalogService } from "./catalog/catalog.service";
import { CatalogController } from "./catalog/catalog.controller";
import { OrderController } from "./orders/order.controller";

// repositories
const sessionRepository = new SessionRepository();
const qrPortRepository = new QrPortRepository();
const connectionsRepository = new ConnectionsRepository();
const orderRepository = new OrderRepository();
const catalogRepository = new CatalogRepository();

// services
const sessionService = new SessionService(sessionRepository);
const qrPortService = new QrPortService(qrPortRepository);
const connectionService = new ConnectionService(connectionsRepository);
const orderService = new OrderService(orderRepository);
const catalogService = new CatalogService(catalogRepository);

// controllers
const sessionController = new SessionController(
  createEndpoint,
  sessionService,
  qrPortService,
  connectionService,
);

const qrPortController = new QrPortController(
  createEndpoint,
  qrPortService,
  connectionService,
);

const catalogController = new CatalogController(createEndpoint, catalogService);
const orderController = new OrderController(createEndpoint, orderService);

export const controllers = {
  session: sessionController,
  qrPort: qrPortController,
  catalog: catalogController,
  order: orderController,
};
