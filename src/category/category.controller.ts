import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryModel } from './model/category.model';
import { CreateCategoryDto } from './dto/category-create.dto';
import { UpdateCategoryDto } from './dto/category-update.dto';
import { JwtAuthGuard } from '../Jwt/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(new JwtAuthGuard(['admin']))
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @UseGuards(new JwtAuthGuard(['admin']))
  async getAllCategories(): Promise<CategoryModel[]> {
    return await this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryByid(@Param('id') id: string): Promise<CategoryModel> {
    return await this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  @UseGuards(new JwtAuthGuard(['admin']))
  async updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryModel | null> {
    return await this.categoryService.updateCategoryById(id, updateCategoryDto);
  }

  @Delete(':id')
  async deleteCategoryById(@Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategoryById(id);
  }
}
