import { getModelForClass, prop } from '@typegoose/typegoose';
export class Product {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  category: string;

  @prop({ required: true, type: () => Number })
  price: number;

  @prop({ required: true })
  description: string;
}

export const ProductModel = getModelForClass(Product);
