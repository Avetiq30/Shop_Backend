import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NestConfigService {
  constructor(private configService: ConfigService) {}

  get expiresInRefreshToken(): string {
    return this.configService.get<string>('EXPIRESINREFRESHTOKEN');
  }

  get expiresInAccessToken(): string {
    return this.configService.get<string>('EXPIRESINACCESSTOKEN');
  }

  get getMongoString(): string {
    return this.configService.get<string>('MONGODB_URI');
  }
}
