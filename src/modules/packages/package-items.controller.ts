import { Controller, Post, Param, Body } from '@nestjs/common';
import { PackageItemsService } from './package-items.service';
import { AddPackageItemDto } from './dto/add-package-item.dto';

@Controller('packages')
export class PackageItemsController {
  constructor(
    private readonly packageItemsService: PackageItemsService,
  ) {}

  @Post(':id/items')
  async addItem(
    @Param('id') packageId: string,
    @Body() body: AddPackageItemDto,
  ) {
    return this.packageItemsService.addPurchaseToPackage({
      packageId,
      purchaseId: body.purchaseId,
    });
  }
}
