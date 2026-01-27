import { IsUUID } from 'class-validator';

export class CreatePackageDto {
  @IsUUID()
  userId: string;
}
