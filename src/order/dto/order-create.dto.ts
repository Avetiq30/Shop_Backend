import { IsNotEmpty } from 'class-validator';
import { ProductModel } from '../../product/model/product.model';

export class CreateOrderDto {
  @IsNotEmpty()
  product: ProductModel;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  customer: string;
}
