import { Controller, Get, Param } from '@nestjs/common';

import { ExpansionService } from './expansion.service';

@Controller('expansions')
export class ExpansionController {
  constructor(private readonly expansionService: ExpansionService) {}

  @Get()
  public async getAll() {
    const expansions = await this.expansionService.findAll();
    return {
      expansions,
    };
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string) {
    const expansion = await this.expansionService.findOne(id);
    return {
      expansion,
    };
  }
}
