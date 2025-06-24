import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category!: string;
}