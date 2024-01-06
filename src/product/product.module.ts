import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from './model/product.model';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: ProductModel,
        schemaOptions: {
          collection: 'products',
          timestamps: true,
        },
      },
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
