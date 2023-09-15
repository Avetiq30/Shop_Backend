import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async hashPassword(
    plainTextPassword: string,
    saltRound: number,
  ): Promise<string> {
    return bcrypt.hash(plainTextPassword, saltRound);
  }
}
