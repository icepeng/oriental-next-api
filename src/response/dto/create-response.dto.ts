import { IsInt, IsString, MaxLength } from 'class-validator';
export class CardResponseDto {
  @IsString() readonly card: string;

  @IsInt() readonly power: number;

  @IsInt() readonly generality: number;

  @IsString()
  @MaxLength(2000)
  readonly description: string;
}

export class ExpansionResponseDto {
  @IsInt() readonly fun: number;

  @IsInt() readonly balance: number;

  @IsString()
  @MaxLength(2000)
  readonly description: string;
}
