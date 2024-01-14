import { Module, ValidationPipe } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { FileModule } from './file/file.module';
import { APP_PIPE } from '@nestjs/core';
import { NestConfigModule } from './configs/config.module';
import { NestConfigService } from './configs/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [NestConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    CartModule,
    CategoryModule,
    OrderModule,
    ProductModule,
    UserModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
