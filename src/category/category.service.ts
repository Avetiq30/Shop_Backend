import { Injectable } from '@nestjs/common';
import { CategoryModel } from './model/category.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateCategoryDto } from './dto/category-create.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<any> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async getAllCategories(): Promise<any[]> {
    return this.categoryModel.find().exec();
  }
  async getCategoryByName(name: string): Promise<CategoryModel | null> {
    return this.categoryModel.findOne({ name }).exec();
  }

  async updateCategory(
    id: string,
    name: string,
  ): Promise<CategoryModel | null> {
    return this.categoryModel.findByIdAndUpdate({ id, name }).exec();
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete({ _id: id }).exec();
  }
}
