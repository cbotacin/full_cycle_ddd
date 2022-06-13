import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface{
  
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {

    entity.items.forEach((item) => {
      this.updateOrderItem(item, entity.id);
    });

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        }, 
      }
    );
  }
  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{ model: OrderItemModel ,  as: 'items' }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const order = transformOrder(orderModel);
    return order;
    
  }

  async findAll(): Promise<Order[]> {
    let orderModels;
    try {
      orderModels = await OrderModel.findAll({
        include: [{ model: OrderItemModel ,  as: 'items' }],
      });
    } catch (error) {
      throw new Error("Order Empty");
    }
    
    const orders = orderModels.map((orderModel) => {
      return transformOrder(orderModel);
    }); 
    
    return orders;
  }

  private async updateOrderItem(item: OrderItem, orderId : string){

    const orderItem = await OrderItemModel.findOne({
      where: { id: item.id },
    });

    
    if(orderItem == null) {
      OrderItemModel.create ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id : orderId
      })
    } else {
      OrderItemModel.update (
        {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id : orderId
        } ,
        {
          where : { id : item.id}
        }
      );
    }
  }
}
function transformOrder(orderModel: OrderModel) : Order{
  return new Order(orderModel.id, orderModel.customer_id,
    orderModel.items.map((item: OrderItemModel) => {
      return new OrderItem(item.id, item.name, item.price / item.quantity, item.product_id, item.quantity);
    }));
}

