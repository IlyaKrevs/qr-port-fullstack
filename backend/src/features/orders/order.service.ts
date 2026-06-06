import { IOrder } from "@globalShared/types/entities/Order.entity";
import { OrderRepository } from "./order.repository";
import { ISession } from "@globalShared/types/entities/Session.entity";

interface IOrderService {
  orderRepository: OrderRepository;
  create(order: IOrder): IOrder;
  getAllBySessionId(sessionId: ISession["id"]): IOrder[];
  changeStatus(
    orderId: IOrder["id"],
    sessionId: ISession["id"],
    status: IOrder["status"],
  ): boolean;
}

export class OrderService implements IOrderService {
  orderRepository: OrderRepository;

  constructor(orderRep: OrderRepository) {
    this.orderRepository = orderRep;
  }

  create(order: IOrder): IOrder {
    return this.orderRepository.create(order);
  }

  getAllBySessionId(sessionId: ISession["id"]): IOrder[] {
    return this.orderRepository.getAllBySessionId(sessionId);
  }

  changeStatus(
    orderId: IOrder["id"],
    sessionId: ISession["id"],
    status: IOrder["status"],
  ): boolean {
    return this.orderRepository.changeStatus(orderId, sessionId, status);
  }
}
