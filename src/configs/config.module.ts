import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [NestConfigService],
  exports: [NestConfigService],
})
export class NestConfigModule {}
