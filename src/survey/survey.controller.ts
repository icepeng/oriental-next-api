import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { Auth } from '../common/auth.decorator';
import { User } from '../user/user.entity';
import { CreateResponseDto } from './dto/create-response.dto';
import { SurveyService } from './survey.service';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  public async getAll() {
    return this.surveyService.findAll();
  }

  @Get('/:id')
  public async getOne(
    @Param('id', new ParseIntPipe())
    id: number,
  ) {
    return this.surveyService.findOne(id);
  }

  @Post('/:id/responses')
  public async createResponse(
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() createResponseDto: CreateResponseDto,
  ) {
    const created = await this.surveyService.createResponse(
      id,
      user,
      createResponseDto,
    );
    return {
      id: created.id,
    };
  }

  @Put('/:surveyId/responses/:id')
  public async updateResponse(
    @Param('id', new ParseIntPipe())
    id: number,
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Auth() user: User,
    @Body() createResponseDto: CreateResponseDto,
  ) {
    const created = await this.surveyService.updateResponse(
      id,
      surveyId,
      user,
      createResponseDto,
    );
    return;
  }
}
