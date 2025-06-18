import { IsUUID, IsString } from 'class-validator'
export class CreateUserDto {
  @IsUUID()
  userId!: string

  @IsString()
  firstName!: string

  @IsString()
  lastName!: string
}