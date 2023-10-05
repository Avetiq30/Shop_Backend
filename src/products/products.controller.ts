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
  @UseInterceptors(FileInterceptor('file', multerConfig)) // Используйте настройки multer
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // Обработка загруженного файла
  }

  @Post()
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductModel> {
    // if (!image) {
    //   throw new HttpException('Image file is missing', HttpStatus.BAD_REQUEST);
    // }
    const productData = {
      ...createProductDto,
      imageUrl: image.filename, // Присвойте имя загруженного файла полю imageUrl
    };
    console.log(productData);

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
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<any> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.deleteProduct(id);
  }
}
