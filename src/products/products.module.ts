import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductModel } from './model/model';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: ProductModel,
        schemaOptions: {
          collection: 'products',
        },
      },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
