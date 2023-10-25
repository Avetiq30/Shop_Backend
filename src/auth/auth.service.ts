import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
import {
  LOGGED_OUT_SUCESSFULLY,
  USER_NOT_FOUND,
  USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}
  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }
  async login(loginDto: LoginDto): Promise<string | null> {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await this.bcryptService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException(
        USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.generateAccessToken(loginDto.email);
  }
  async logout(session): Promise<{ message: string }> {
    if (session) {
      session.destroy();
    }
    return { message: LOGGED_OUT_SUCESSFULLY };
  }
}
