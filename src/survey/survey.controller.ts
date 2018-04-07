import { Controller, Get, Param } from '@nestjs/common';

import { SurveyService } from './survey.service';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  public async getAll() {
    return this.surveyService.findAll();
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string) {
    return this.surveyService.findOne(id);
  }
}
