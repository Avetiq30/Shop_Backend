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
import { COULD_NOT_GENERATE_TOKEN } from './auth.constants';

interface CustomRequest extends Request {
  session: any;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authLoginDto: AuthLoginDto) {
    const token = await this.authService.login(authLoginDto);
    if (!token) {
      throw new HttpException(COULD_NOT_GENERATE_TOKEN, HttpStatus.FORBIDDEN);
    }
    return { token };
  }
  @Post('logout')
  async logout(@Req() req: CustomRequest) {
    const session = req.session;
    return this.authService.logout(session);
  }
}
