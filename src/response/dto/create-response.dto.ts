import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsString, ValidateNested } from 'class-validator';
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

export class CreateResponseDto { // TODO: remove after fix release
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(type => CardResponseDto)
  readonly cardResponses: CardResponseDto[];

  @ValidateNested()
  @IsDefined()
  @Type(type => ExpansionResponseDto)
  readonly expansionResponse: ExpansionResponseDto;
}
