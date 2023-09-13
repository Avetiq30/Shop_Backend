import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isPasswordValid =  bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const payload = { email: user.email, sub: user.password };
        const token = this.jwtService.sign(payload);
        return { token };
      }
    }
    return null;
  }
}
