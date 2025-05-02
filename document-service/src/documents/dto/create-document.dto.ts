// document-service/src/documents/dto/create-document.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}