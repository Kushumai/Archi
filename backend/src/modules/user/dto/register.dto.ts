import { IsNotEmpty, IsString, IsEmail, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;


  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  roles!: number[];
}
