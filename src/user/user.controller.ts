import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { USER_WITH_THIS_EMAIL } from './user.constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() userData: UserModel) {
    const existingUser = await this.userService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error(USER_WITH_THIS_EMAIL);
    }
    const createdUser = await this.userService.createUser(userData);

    return createdUser;
  }
}