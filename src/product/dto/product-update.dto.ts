import { ProductCreateDto } from './product-create.dto';
import { IsString } from 'class-validator';

export class ProductUpdateDto extends ProductCreateDto {
  @IsString()
  _id: string;
}
