import { Module } from '@nestjs/common';
import { CategoryModel } from './model/category.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CategoryModel,
        schemaOptions: {
          collection: 'category',
        },
      },
    ]),
  ],
  providers: [CategoryService, CategoryModel],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
