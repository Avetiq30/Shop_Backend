import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category: string;
}
