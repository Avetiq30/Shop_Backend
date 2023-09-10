import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { CreateProductDto } from 'src/products/dto/product.dto';

export class OrderDto {
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  customerEmail: string;

  @IsArray()
  @ArrayNotEmpty()
  products: CreateProductDto[];
}

export class UpdateDto {
  @IsArray()
  @ArrayNotEmpty()
  products: CreateProductDto[];
}
