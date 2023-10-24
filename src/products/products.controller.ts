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
import { ProductModel } from './model/model';
import { ProductCreateDto } from './dto/create.dto';
import { ProductUpdateDto } from './dto/update.dto';
import { NOT_PRODUCT_BY_ID } from '../products/prdouct-constants';
import { ProductFilterDto } from './dto/query.dto';

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
  async getAllProduct(@Query()productFilterDto:ProductFilterDto): Promise<ProductModel[]> {
    return await this.productService.getAllProduct( productFilterDto);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductModel> {
    try {
      return await this.productService.getProductById(id);
    } catch  {
      throw new HttpException(
        NOT_PRODUCT_BY_ID,
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
