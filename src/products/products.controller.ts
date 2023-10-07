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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductModel } from './product.model/product.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../configs/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Post()
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductModel> {
    const productData = {
      ...createProductDto,
      imageUrl: createProductDto.image,
    };
    return await this.productService.createProduct(productData);
  }
  @Get()
  async getAllProduct(): Promise<ProductModel[]> {
    return await this.productService.getAllProduct();
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
    @UploadedFile() image: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<any> {
    const productData = {
      ...updateProductDto,
      imageUrl: updateProductDto.image,
    };
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.deleteProduct(id);
  }
}
