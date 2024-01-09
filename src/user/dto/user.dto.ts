import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  name: string;

  @IsNotEmpty()
  @Length(5, 30)
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @IsNotEmpty()
  @Length(6, 18)
  phone: string;

  @IsOptional()
  @Length(0, 200)
  address?: string;
}
