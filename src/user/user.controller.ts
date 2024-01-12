import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../Jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Get()
  @UseGuards(new JwtAuthGuard(['admin']))
  async getAll() {
    const users = await this.userService.getAllUser();
    return users;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getUserById(id);
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
