import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roles?: number[];
}