import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import * as bcrypt from 'bcrypt';
import { getModelForClass } from '@typegoose/typegoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}

  async createUser(user: UserModel): Promise<UserModel> {
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashPassword };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async deleteAll(){
    return getModelForClass(UserModel).deleteMany({})
  }
}