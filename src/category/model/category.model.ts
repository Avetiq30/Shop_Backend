import { prop } from '@typegoose/typegoose';

export class CategoryModel {
  @prop({ required: true, unique: true })
  name: string;
}
