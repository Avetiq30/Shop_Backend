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

  async getCategoryById(id: string): Promise<CategoryModel | null> {
    return this.categoryModel.findById(id).exec();
  }

  async updateCategoryById(
    id: string,
    name: string,
  ): Promise<CategoryModel | null> {
    return this.categoryModel.findByIdAndUpdate({ id, name }).exec();
  }

  async deleteCategoryById(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete({ _id: id }).exec();
  }

  async deleteAll() {
    return this.categoryModel.deleteMany();
  }
}
