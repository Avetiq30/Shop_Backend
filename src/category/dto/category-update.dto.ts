import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 15)
  name: string;
}
