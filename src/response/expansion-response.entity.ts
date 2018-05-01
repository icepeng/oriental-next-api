import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExpansionResponseDto } from './dto/create-response.dto';
import { SurveyResponse } from './survey-response.entity';

@Entity()
export class ExpansionResponse {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(type => SurveyResponse, response => response.expansionResponse, {
    nullable: false,
  })
  @JoinColumn()
  response: SurveyResponse;

  @Column() fun: number;

  @Column() balance: number;

  @Column('text') description: string;

  applyData(expansionResponseDto: ExpansionResponseDto) {
    this.fun = expansionResponseDto.fun;
    this.balance = expansionResponseDto.balance;
    this.description = expansionResponseDto.description;
  }
}
