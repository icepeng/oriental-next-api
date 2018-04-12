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
import {
  CardResponseDto,
  ExpansionResponseDto,
} from './dto/create-response.dto';
import { ResponseService } from './response.service';

@Controller('surveys/:surveyId/responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

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
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
  ) {
    const created = await this.responseService.create(id, user);
    return {
      id: created.id,
    };
  }

  @Post(':id/card-responses')
  public async createCardResponse(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() cardResponseDto: CardResponseDto,
  ) {
    const created = await this.responseService.createCardResponse(
      id,
      surveyId,
      user,
      cardResponseDto,
    );
    return;
  }

  @Post(':id/expansion-response')
  public async createExpansionResponse(
    @Param('surveyId', new ParseIntPipe())
    surveyId: number,
    @Param('id', new ParseIntPipe())
    id: number,
    @Auth() user: User,
    @Body() expansionResponseDto: ExpansionResponseDto,
  ) {
    const created = await this.responseService.createExpansionResponse(
      id,
      surveyId,
      user,
      expansionResponseDto,
    );
    return;
  }
}
