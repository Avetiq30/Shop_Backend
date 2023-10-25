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
import { ProductService } from './product.service';
import { ProductModel } from './model/product.model';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { NOT_FOUND_PRODUCT_BY_ID } from './prdouct.constants';
import { ProductFilterDto } from './dto/product-filter.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: ProductCreateDto,
  ): Promise<ProductModel> {
    return this.productService.createProduct(createProductDto);
  }
  @Get()
  async getAllProduct(
    @Query() productFilterDto: ProductFilterDto,
  ): Promise<ProductModel[]> {
    return await this.productService.getAllProduct(productFilterDto);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductModel> {
    try {
      return await this.productService.getProductById(id);
    } catch (e) {
      console.error(e);
      throw new HttpException(NOT_FOUND_PRODUCT_BY_ID, HttpStatus.NOT_FOUND);
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
