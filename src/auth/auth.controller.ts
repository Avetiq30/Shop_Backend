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
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authLoginDto: AuthLoginDto) {
    const token = await this.authService.login(authLoginDto);
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
