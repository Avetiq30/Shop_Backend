import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../Jwt/jwt-auth.guard';
import { UNAUTHORIZED } from './user.constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req) {
    const role = req.user.role;
    if (role !== 'admin') {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const users = await this.userService.getAllUser();
    if (users.length === 0) {
      return { statusCode: HttpStatus.OK, body: [] };
    }
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
