import { ProductModel } from '../../product/model/product.model';
import { Column, CreateDateColumn, JoinTable, ManyToMany } from 'typeorm';
export class OrderModel {
  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @CreateDateColumn()
  orderDate: Date;

  @ManyToMany(() => ProductModel)
  @JoinTable()
  products: ProductModel[];
}
