import { Injectable } from '@nestjs/common';
import { CategoryModel } from './category.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateCategoryDto } from './categoryDto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<any> {
    const category = new this.categoryModel(createCategoryDto);
    return await category.save();
  }

  async getAllCategories(): Promise<any[]> {
    return await this.categoryModel.find().exec();
  }
  async getCategoryById(id: string): Promise<CategoryModel | null> {
    return await this.categoryModel.findById(id).exec();
  }

  async updateCategory(
    id: string,
    name: string,
  ): Promise<CategoryModel | null> {
    return await this.categoryModel.findByIdAndUpdate({ id, name }).exec();
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete({ id }).exec();
  }
}
