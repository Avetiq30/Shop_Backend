import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.model/product.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('create')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductDto);
  }
  @Get()
  async getAllProduct(): Promise<Product[]> {
    return await this.productService.getAllProduct();
  }
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productService.getProductById(id);
  }
  @Put('id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.updateProduct(id, updateProductDto);
  }
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.deleteProduct(id);
  }
}
