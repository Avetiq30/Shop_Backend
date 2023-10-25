import { Module, ValidationPipe } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './product/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { FileModule } from './file/file.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    CartModule,
    CategoryModule,
    OrderModule,
    ProductsModule,
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
