import { Ref, prop } from '@typegoose/typegoose';
import { CategoryModel } from '../../category/model/category.model';
export class ProductModel {
  @prop({ required: true })
  name: string;

  @prop({ ref: () => CategoryModel, required: true })
  categoryId!: Ref<CategoryModel>;

  @prop({ required: true, type: () => Number })
  price: number;

  @prop({ required: true })
  description: string;

  @prop()
  imageId: string;

  @prop({ type: Date, default: Date.now })
  addedDate: string;
}
