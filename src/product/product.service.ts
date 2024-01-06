import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from './model/product.model';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CategoryService } from '../category/category.service';
import { NOT_FOUND_CATEGORY, PRODUCT_NOT_FOUND } from './prdouct.constants';
import { getModelForClass } from '@typegoose/typegoose';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { FileModel } from '../file/file.model';
import { CategoryModel } from '../category/model/category.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ReturnModelType<typeof ProductModel>,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(createProductDto: ProductCreateDto): Promise<any> {
    const category = await this.categoryService.getCategoryById(
      createProductDto.category,
    );
    if (!category) {
      throw new NotFoundException(NOT_FOUND_CATEGORY);
    }

    const newProduct = new this.productModel(createProductDto);
    await newProduct.populate({
      path: 'image',
      model: FileModel.name,
    });
    await newProduct.populate({
      path: 'category',
      model: CategoryModel.name,
    });
    return newProduct.save();
  }

  async getAllProduct(productFilterDto: ProductFilterDto): Promise<any> {
    const {
      minPrice,
      maxPrice,
      categoryId,
      page = 1,
      pageSize = 10,
      searchText,
    } = productFilterDto;
    const filter: any = {};
    if (minPrice) {
      filter.price = { ...filter.price, $gte: minPrice };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }
    if (categoryId) {
      filter.category = categoryId;
    }
    if (searchText) {
      filter.name = searchText;
      delete filter.price;
    }
    const skip = (page - 1) * pageSize;
    const products = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'image',
        model: FileModel.name,
      })
      .populate({
        path: 'category',
        model: CategoryModel.name,
      })
      .exec();
    const totalProducts = await this.productModel.countDocuments(filter);
    return {
      totalProducts,
      currentPage: page,
      pageSize,
      products,
    };
  }

  async getProductById(id: string): Promise<ProductModel | null> {
    // const product = await this.productModel.findById(id).exec();
    //  console.log(product);
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
