import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('packages')
export class PackagesController {
  @Get()
  list() {
    return {
      message: 'packages endpoint ok',
    };
  }

  @Post(':id/choice')
  choose(
    @Param('id') packageId: string,
    @Body() body: { option: string },
  ) {
    return {
      message: 'package choice received',
      packageId,
      choice: body.option,
    };
  }
}
