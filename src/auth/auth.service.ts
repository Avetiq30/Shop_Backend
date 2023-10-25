import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
import {
  LOGGED_OUT_SUCESSFULLY,
  USER_NOT_FOUND,
  USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT,
} from './auth.constants';

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
  async login(email: string, password: string): Promise<string | null> {
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
        HttpStatus.FORBIDDEN,
      );
    }
    return this.generateAccessToken({ email });
  }
  async logout(req: any): Promise<{ message: string }> {
    if (req.session) {
      req.session.destroy();
    }
    return { message: LOGGED_OUT_SUCESSFULLY };
  }
}
