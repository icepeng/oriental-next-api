import { Controller, Get, Param } from '@nestjs/common';

import { CardService } from './card.service';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  public async getAll() {
    return this.cardService.findAll();
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string) {
    return this.cardService.findOne(id);
  }
}
