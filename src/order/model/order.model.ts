import { ProductModel } from '../../product/model/product.model';

export class OrderModel {
  customer: string;

  customerEmail: string;

  priice: number;

  products: ProductModel[];
}
