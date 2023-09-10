import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from './product.model/product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }
  async getAllProduct(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }
  async getProductById(id: string): Promise<Product | null> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
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
