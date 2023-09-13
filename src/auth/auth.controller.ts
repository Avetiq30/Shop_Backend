import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const result = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );

    if (!result) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return { token: result.token };
  }
}
