import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  description: string;

  @IsNotEmpty()
  image: string;
}
