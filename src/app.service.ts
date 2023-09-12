import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public name = 'test';
  getHello(): string {
    return 'Hello World!';
  }
}
