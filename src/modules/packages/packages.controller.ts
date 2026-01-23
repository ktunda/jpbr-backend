import { Controller, Get } from '@nestjs/common';

@Controller('packages')
export class PackagesController {
  @Get()
  list() {
    return {
      message: 'packages endpoint ok',
    };
  }
}
