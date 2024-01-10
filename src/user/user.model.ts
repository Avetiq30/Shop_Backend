import { prop } from '@typegoose/typegoose';

export class UserModel {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public lastname!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ enum: ['admin', 'user'], default: 'user' })
  public role!: string;

  @prop({ required: true })
  public phone!: string;

  @prop()
  public address?: string;
}
