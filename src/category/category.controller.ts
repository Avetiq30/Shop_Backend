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
import { CategoryModel } from './category.model';
import { CreateCategoryDto } from './categoryDto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
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
  async getCategoryById(
    @Param('id') id: string,
  ): Promise<CategoryModel | null> {
    return await this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<CategoryModel | null> {
    return await this.categoryService.updateCategory(id, name);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }
}
