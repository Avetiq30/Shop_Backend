import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto//order-create.dto';
import { OrderModel } from './model/order.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderModel)
    private readonly orderModel: ReturnModelType<typeof OrderModel>,
  ) {}

  getAllOrders(): Promise<OrderModel[]> {
    return this.orderModel.find().exec();
  }

  getOrderById(id: string): Promise<OrderModel | null> {
    return this.orderModel.findById(id).exec();
  }

  createOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }
}
