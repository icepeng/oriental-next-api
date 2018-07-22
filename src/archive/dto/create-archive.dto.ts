import { IsString, MaxLength } from 'class-validator';

export class CreateArchiveDto {
  @IsString() readonly cardResponseId: number;

  @IsString()
  @MaxLength(2000)
  readonly description: string;
}
