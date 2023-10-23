import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { ProductCreateDto } from '../../products/dto/product-create.dto';

export class OrderDto {
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  customerEmail: string;

  @IsArray()
  @ArrayNotEmpty()
  products: ProductCreateDto[];
}

export class UpdateDto {
  @IsArray()
  @ArrayNotEmpty()
  products: ProductCreateDto[];
}
