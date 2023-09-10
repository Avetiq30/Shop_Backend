import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductModel } from './product.model/product.model';

@Module({
  imports: [TypegooseModule.forFeature([ProductModel])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
