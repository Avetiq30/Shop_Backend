import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async isValidateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return false;
    }
    return this.bcryptService.comparePassword(password, user.password);
  }

  async generateAccessToken(payload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async login(email: string, password: string): Promise<string | null> {
    const isValidateUser = await this.isValidateUser(email, password);
    if (!isValidateUser) {
      return null;
    }
    return this.generateAccessToken({ email });
  }
}
