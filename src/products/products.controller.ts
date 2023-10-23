import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductModel } from './product.model/product.model';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { log } from 'console';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: ProductCreateDto,
  ): Promise<ProductModel> {
   return this.productService.createProduct(createProductDto);
  }
  @Get()
  async getAllProduct(
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('category') category: string,
    // @Query('addedDate') addedDate: string,
  ): Promise<ProductModel[]> {
    return await this.productService.getAllProduct(minPrice, maxPrice, category, );
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductModel> {
    try {
      return await this.productService.getProductById(id);
    } catch (e) {
      throw new HttpException(
        'Could not found product by id',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<ProductUpdateDto>,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.deleteProduct(id);
  }

}
