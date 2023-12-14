import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('all')
  async getAll() {
    return this.userService.getAllUser();
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.updateUserById(id, createUserDto);
  }
}
