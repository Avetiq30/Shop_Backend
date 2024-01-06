import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
} from 'class-validator';

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
  categoryId: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  @IsPositive()
  @IsInt()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  @IsPositive()
  @IsInt()
  pageSize?: number;

  @IsOptional()
  @IsString()
  searchText?: string;
}
