import { Ref, prop } from '@typegoose/typegoose';
import { CategoryModel } from 'src/category/category.model';
export class ProductModel {
  @prop({ required: true })
  name: string;

  @prop({ ref: () => CategoryModel, required: true })
  category!: Ref<CategoryModel>;

  @prop({ required: true, type: () => Number })
  price: number;

  @prop({ required: true })
  description: string;
}
