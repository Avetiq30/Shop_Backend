import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config'; // Импортируйте ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // Инъекция ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
      secretOrKey: configService.get('JWT_SECRET'), // Получение секретного ключа из ConfigService
    });
  }

  async validate(email:string,password:string) {
    const user = await this.authService.validateUser(email,password)

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
