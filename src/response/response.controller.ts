import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Auth } from '../common/auth.decorator';
import { User } from '../user/user.entity';
import { CardResponseService } from './card-response.service';
import {
  CardResponseDto,
  ExpansionResponseDto,
} from './dto/create-response.dto';
import { ExpansionResponseService } from './expansion-response.service';
import { ResponseService } from './response.service';

@Controller('surveys/:surveyId/responses')
export class ResponseController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly cardResponseService: CardResponseService,
    private readonly expansionResponseService: ExpansionResponseService,
  ) {}
  @Get('/random')
  public async getRandom(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
  ) {
    const response = await this.responseService.getRandom(surveyId);
    return {
      response,
    };
  }

  @Get('/:id')
  public async getOne(
    @Param('id', new ParseIntPipe())
    id: number,
  ) {
    const response = await this.responseService.getOne(id);
    if (!response) {
      throw new NotFoundException();
    }
    return {
      response,
    };
  }

  @Post()
  public async create(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Auth() user: User,
  ) {
    const created = await this.responseService.create(surveyId, user);
    return {
      id: created.id,
    };
  }

  @Post(':id/card-responses')
  public async saveCardResponse(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() cardResponseDto: CardResponseDto,
  ) {
    const result = await this.cardResponseService.save(
      id,
      surveyId,
      user,
      cardResponseDto,
    );
    return {
      point: result[1].point.amount,
    };
  }

  @Post(':id/expansion-response')
  public async saveExpansionResponse(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() expansionResponseDto: ExpansionResponseDto,
  ) {
    const result = await this.expansionResponseService.save(
      id,
      surveyId,
      user,
      expansionResponseDto,
    );
    return {
      point: result[1].point.amount,
    };
  }
}
