import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: { email: string; password: string }) {
    const token = await this.authService.login(
      loginData.email,
      loginData.password,
    );

    if (!token) {
      throw new HttpException(
        'Could not generate access token',
        HttpStatus.FORBIDDEN,
      );
    }
    return { token };
  }
  @Post('logout')
  async logout(@Req() req: any): Promise<any> {
    return this.authService.logout(req);
  }
}
