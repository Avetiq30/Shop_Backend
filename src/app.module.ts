import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { FilesModule } from './files/files.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from '../configs/mongo.config';

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
    FilesModule,
    OrderModule,
    ProductsModule,
    UserModule,
  ],
})
export class AppModule {}
