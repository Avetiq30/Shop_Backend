import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryModel } from './model/category.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateCategoryDto } from './dto/category-create.dto';
import { CATEGORY_FOR_THIS_ID_NOT_FOUND } from './category.constants';
import { UpdateCategoryDto } from './dto/category-update.dto';

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
    categorydata: UpdateCategoryDto,
  ): Promise<CategoryModel | null> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, categorydata, { new: true })
      .exec();
    if (!category) {
      throw new HttpException(
        CATEGORY_FOR_THIS_ID_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async deleteCategoryById(id: string): Promise<any> {
    const category = await this.categoryModel
      .findByIdAndDelete({ _id: id })
      .exec();
    if (!category) {
      throw new HttpException(
        CATEGORY_FOR_THIS_ID_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async deleteAll() {
    return this.categoryModel.deleteMany();
  }
}
