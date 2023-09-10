import { prop, getModelForClass } from '@typegoose/typegoose';

export  class UserModel {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public lastname!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}


