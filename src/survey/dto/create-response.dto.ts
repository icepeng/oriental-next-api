import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  ValidateNested,
  IsIn,
  IsDefined,
} from 'class-validator';

export class CardResponseDto {
  @IsString() readonly card: string;

  @IsInt() readonly power: number;

  @IsInt() readonly generality: number;

  @IsString() readonly description: string;
}

export class ExpansionResponseDto {
  @IsInt() readonly fun: number;

  @IsInt() readonly balance: number;

  @IsString() readonly description: string;
}

export class CreateResponseDto {
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(type => CardResponseDto)
  readonly cardResponses: CardResponseDto[];

  @ValidateNested()
  @IsDefined()
  @Type(type => ExpansionResponseDto)
  readonly expansionResponse: ExpansionResponseDto;
}
