import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackageChoiceDto } from './dto/package-choice.dto';
import { CreatePackageDto } from './dto/create-package.dto';
import type { PackageActor } from '../../domain/package/package.state-machine';
import { AdvancePackageStatusDto } from './dto/advance-package-status.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  list() {
    return {
      message: 'packages endpoint ok',
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.packagesService.findById(id);
  }

  /**
   * Criação do Package
   */
  @Post()
  async create(@Body() body: CreatePackageDto) {
    return this.packagesService.create({
      userId: body.userId,
    });
  }

  /**
   * Escolha de consolidação pelo cliente
   */
  @Post(':id/choice')
  async choose(
    @Param('id') packageId: string,
    @Body() body: PackageChoiceDto,
  ) {
    // Ator fixo por enquanto
    const actor: PackageActor = 'CLIENT';

    return this.packagesService.chooseConsolidation({
      packageId,
      choice: body.option,
      actor,
    });
  }


  /**
   * Avançar status do package (uso interno / sistema)
   */
  @Post(':id/advance')
  async advanceStatus(
    @Param('id') packageId: string,
    @Body() body: AdvancePackageStatusDto,
  ) {
    return this.packagesService.advanceStatus({
      packageId,
      toStatus: body.toStatus,
    });
  }


}

