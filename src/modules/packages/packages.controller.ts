import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackageChoiceDto } from './dto/package-choice.dto';
import type { PackageActor } from '../../domain/package/package.state-machine';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  list() {
    return {
      message: 'packages endpoint ok',
    };
  }

  @Post(':id/choice')
  async choose(
    @Param('id') packageId: string,
    @Body() body: PackageChoiceDto,
  ) {
    // Por enquanto, o ator vem fixo (CLIENT)
    const actor: PackageActor = 'CLIENT';

    const updatedPackage = await this.packagesService.chooseConsolidation({
      packageId,
      choice: body.option,
      actor,
    });

    return updatedPackage;
  }
}
