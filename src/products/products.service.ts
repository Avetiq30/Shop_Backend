import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from './model/model';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CategoryService } from '../category/category.service';
import {
  NOT_FOUND_CATEGORY,
  PRODUCT_NOT_FOUND,
} from '../products/prdouct-constants';
import { getModelForClass } from '@typegoose/typegoose';
import { ProductCreateDto } from './dto/create.dto';
import { ProductUpdateDto } from './dto/update.dto';
import { ProductFilterDto } from './dto/query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ReturnModelType<typeof ProductModel>,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(createProductDto: ProductCreateDto): Promise<any> {
    const category = await this.categoryService.getCategoryByName(
      createProductDto.category,
    );
    if (!category) {
      throw new NotFoundException(NOT_FOUND_CATEGORY);
    }
    const newProduct = new this.productModel({ ...createProductDto, category });
    return newProduct.save();
  }

  async getAllProduct(productFilterDto: ProductFilterDto): Promise<any> {
    const { minPrice, maxPrice, category } = productFilterDto;
    const filter: any = {};

    if (minPrice !== undefined) {
      filter.price = { $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      if (filter.price) {
        filter.price.$lte = maxPrice;
      } else {
        filter.price = { $lte: maxPrice };
      }
    }
    if (category) {
      filter.category = category;
    }

    return this.productModel.find(filter).exec();
  }

  async getProductById(id: string): Promise<ProductModel | null> {
    return this.productModel.findById(id).exec();
  }

  async updateProduct(
    id: string,
    updateProductDto: Partial<ProductUpdateDto>,
  ): Promise<ProductModel> {
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

  async deleteAll() {
    return getModelForClass(ProductModel).deleteMany({});
  }
}
