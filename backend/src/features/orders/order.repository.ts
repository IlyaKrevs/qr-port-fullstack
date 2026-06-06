import { IOrder } from "@globalShared/types/entities/Order.entity";
import { ISession } from "@globalShared/types/entities/Session.entity";

interface IOrderRepository {
  orders: IOrder[];
  create(order: IOrder): IOrder;
  getAllBySessionId(sessionId: ISession["id"]): IOrder[];
  changeStatus(
    orderId: IOrder["id"],
    sessionId: ISession["id"],
    status: IOrder["status"],
  ): boolean;
}

export class OrderRepository implements IOrderRepository {
  static instanse: OrderRepository;
  orders: IOrder[] = [];

  constructor() {
    if (OrderRepository.instanse) {
      return OrderRepository.instanse;
    }
    OrderRepository.instanse = this;
  }

  create(order: IOrder): IOrder {
    this.orders.push(order);
    return order;
  }

  getAllBySessionId(sessionId: ISession["id"]): IOrder[] {
    const orders = this.orders.filter((i) => i.sessionId === sessionId);
    return orders;
  }

  changeStatus(
    orderId: IOrder["id"],
    sessionId: ISession["id"],
    status: IOrder["status"],
  ): boolean {
    const order = this.orders.find(
      (i) => i.sessionId === sessionId && i.id === orderId,
    );
    if (!order) {
      return false;
    }
    order.status = status;
    return true;
  }
}
