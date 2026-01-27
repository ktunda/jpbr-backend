import { IsEnum } from 'class-validator';
import { PackageStatus } from '../../../domain/package/package-status.enum';

export class AdvancePackageStatusDto {
  @IsEnum(PackageStatus)
  toStatus: PackageStatus;
}
