import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
import { AuthLoginDto } from './dto/auth-login.dto';

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

  async login(authLoginDto: AuthLoginDto): Promise<string | null> {
    const { email, password } = authLoginDto;

    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await this.bcryptService.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        'User password or email is not correct ',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.generateAccessToken({ email });
  }
  async logout(req: any): Promise<any> {
    if (req.session) {
      req.session.destroy();
    }
    return { message: 'Logged out successfully' };
  }
}
