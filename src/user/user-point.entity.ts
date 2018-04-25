import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardResponse } from '../response/card-response.entity';
import { ExpansionResponse } from '../response/expansion-response.entity';
import { User } from './user.entity';

@Entity()
export class UserPoint {
  @PrimaryGeneratedColumn() id: string;

  @ManyToOne(type => User, user => user.points, { nullable: false })
  user: User;

  @OneToOne(type => CardResponse, cardResponse => cardResponse.point)
  @JoinColumn()
  cardResponse: CardResponse;

  @OneToOne(
    type => ExpansionResponse,
    expansionResponse => expansionResponse.point,
  )
  @JoinColumn()
  expansionResponse: ExpansionResponse;

  @Column() amount: number;
}
