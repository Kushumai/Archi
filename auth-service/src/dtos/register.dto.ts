import { IsNotEmpty, IsString, IsEmail, IsArray, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;


  @IsArray()
  @IsNumber({}, { each: true })
  roles!: number[];
}