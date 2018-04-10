import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { Auth } from '../common/auth.decorator';
import { User } from '../user/user.entity';
import { SurveyService } from './survey.service';
import {
  CardResponseDto,
  ExpansionResponseDto,
} from './dto/create-response.dto';

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
  ) {
    const created = await this.surveyService.createResponse(id, user);
    return {
      id: created.id,
    };
  }

  @Post('/:surveyId/responses/:id/card-responses')
  public async createCardResponse(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() cardResponseDto: CardResponseDto,
  ) {
    const created = await this.surveyService.createCardResponse(
      id,
      surveyId,
      user,
      cardResponseDto,
    );
    return;
  }

  @Post('/:surveyId/responses/:id/expansion-response')
  public async createExpansionResponse(
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() expansionResponseDto: ExpansionResponseDto,
  ) {
    const created = await this.surveyService.createExpansionResponse(
      id,
      user,
      expansionResponseDto,
    );
    return;
  }
}
