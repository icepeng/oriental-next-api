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
