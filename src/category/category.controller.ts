import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryModel } from './model/category.model';
import { CreateCategoryDto } from './dto/category-create.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories(): Promise<CategoryModel[]> {
    return await this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryByid(@Param('id') id: string): Promise<CategoryModel> {
    return await this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  async updateCategoryById(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<CategoryModel | null> {
    return await this.categoryService.updateCategoryById(id, name);
  }

  @Delete(':id')
  async deleteCategoryById(@Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategoryById(id);
  }
}
