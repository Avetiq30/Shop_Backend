import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { getModelForClass } from '@typegoose/typegoose';
import { BcryptService } from '../auth/bcrypt.service';
import { USER_WITH_THIS_EMAIL } from './user.constants';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly bcryptService: BcryptService,
  ) {}

  async createUser(user: UserModel): Promise<UserModel> {
    const hashedPassword = await this.bcryptService.hashPassword(
      user.password,
      10,
    );
    const newUser = { ...user, password: hashedPassword };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async deleteAll() {
    return getModelForClass(UserModel).deleteMany({});
  }

  async registerUser(userData: CreateUserDto) {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new HttpException(USER_WITH_THIS_EMAIL, HttpStatus.BAD_REQUEST);
    }
    return this.createUser(userData);
  }
  async getUserById(id: string): Promise<UserModel | null> {
    return this.userModel.findById(id).exec();
  }

  async getAllUser(): Promise<UserModel[]> {
    return this.userModel.find().exec();
  }

  async deleteUserById(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updateUserById(
    id: string,
    userData: CreateUserDto,
  ): Promise<UserModel | null> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }
}
