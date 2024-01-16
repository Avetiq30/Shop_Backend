import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import {
  USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT,
  USER_NOT_FOUND,
} from './auth.constants';
import { UserModel } from '../user/user.model';
import { getModelForClass } from '@typegoose/typegoose';
import { NestConfigService } from '../configs/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly nestConfigService: NestConfigService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: this.nestConfigService.expiresInAccessToken,
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: this.nestConfigService.expiresInRefreshToken,
    });
  }

  async login(
    authLoginDto: AuthLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const { email, password } = authLoginDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await this.bcryptService.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const accessToken = await this.generateAccessToken({
      email,
      role: user.role,
    });
    const refreshToken = await this.generateRefreshToken({
      email,
      role: user.role,
    });
    return { accessToken, refreshToken };
  }

  async logout(session): Promise<{ message: string }> {
    if (session) {
      session.destroy();
    }
    return { message: 'Logged out successfully' };
  }

  async deleteAll() {
    return getModelForClass(UserModel).deleteMany({});
  }
}
