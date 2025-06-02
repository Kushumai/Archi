// document-service/src/documents/dto/create-document.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

}