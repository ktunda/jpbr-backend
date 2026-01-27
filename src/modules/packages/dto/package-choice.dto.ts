import { IsEnum } from 'class-validator';

export enum PackageChoice {
  CONSOLIDATE = 'CONSOLIDATE',
  DO_NOT_CONSOLIDATE = 'DO_NOT_CONSOLIDATE',
}

export class PackageChoiceDto {
  @IsEnum(PackageChoice)
  option: PackageChoice;
}
