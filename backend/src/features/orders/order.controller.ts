import { IOrder } from "@globalShared/types/entities/Order.entity";
import { OrderService } from "./order.service";
import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { ISession } from "@globalShared/types/entities/Session.entity";

// create
type CreateBody = IOrder;
type CreateResponse = IOrder;
type CreateEndpoint = typeof createEndpoint<CreateBody, CreateResponse>;

// getAll
type GetAllBody = { sessionId: ISession["id"] };
type GetAllResponse = IOrder[];
type GetAllEndpoint = typeof createEndpoint<GetAllBody, GetAllResponse>;

// change status
type ChangeStatusBody = {
  orderId: IOrder["id"];
  sessionId: ISession["id"];
  status: IOrder["status"];
};
type ChangeStatusResponse = { success: boolean };
type ChangeStatusEndpoint = typeof createEndpoint<
  ChangeStatusBody,
  ChangeStatusResponse
>;

interface IOrderController {
  orderService: OrderService;
  authEndpoint: typeof createEndpoint;
  create(): ReturnType<CreateEndpoint>;
  getAll(): ReturnType<GetAllEndpoint>;
  changeStatus(): ReturnType<ChangeStatusEndpoint>;
}

export class OrderController implements IOrderController {
  orderService: OrderService;
  authEndpoint: typeof createEndpoint;

  constructor(orderService: OrderService, authFn: typeof createEndpoint) {
    this.orderService = orderService;
    this.authEndpoint = authFn;
  }

  create() {
    return this.authEndpoint<CreateBody, CreateResponse>(
      async (req, userUniqId) => {
        const order = req.body;

        const newOrder = this.orderService.create(order);
        return newOrder;
      },
    );
  }

  getAll() {
    return this.authEndpoint<GetAllBody, GetAllResponse>(
      async (req, userUniqId) => {
        const { sessionId } = req.body;
        const all = this.orderService.getAllBySessionId(sessionId);
        return all;
      },
    );
  }

  changeStatus() {
    return this.authEndpoint<ChangeStatusBody, ChangeStatusResponse>(
      async (req, userUniqId) => {
        const { orderId, sessionId, status } = req.body;
        const result = this.orderService.changeStatus(
          orderId,
          sessionId,
          status,
        );

        return { success: result };
      },
    );
  }
}
