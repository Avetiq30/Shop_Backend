import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from './product.model/product.model';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { InjectModel } from 'nestjs-typegoose';
import { CategoryService } from 'src/category/category.service';
import { NOT_FOUND_CATEGORY, PRODUCT_NOT_FOUND } from './constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ReturnModelType<typeof ProductModel>,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<any> {
    const category = await this.categoryService.getCategoryById(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException(NOT_FOUND_CATEGORY);
    }
    const newProduct = new this.productModel({ ...createProductDto, category });
    return await newProduct.save();
  }
  async getAllProduct(): Promise<any[]> {
    return await this.productModel.find().exec();
  }
  async getProductById(id: string): Promise<any | null> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<any> {
    const updatedProduct = await this.productModel
      .findOneAndUpdate({ _id: id }, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productModel.findByIdAndRemove(id).exec();
  }
}
