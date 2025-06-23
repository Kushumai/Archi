// document-service/src/documents/dto/create-document.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;
  
  @IsOptional()
  @IsString()
  description?: string;

}