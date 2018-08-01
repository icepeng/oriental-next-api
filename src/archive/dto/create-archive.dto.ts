import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateArchiveDto {
  @IsInt() readonly cardResponseId: number;

  @IsString()
  @MaxLength(2000)
  readonly description: string;
}
