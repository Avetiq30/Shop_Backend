import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category: string;
}
