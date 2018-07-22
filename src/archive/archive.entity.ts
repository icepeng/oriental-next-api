import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { CardResponse } from '../response/card-response.entity';

@Entity()
export class Archive {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() createTime: string;

  @Column('text') description: string;

  @Column() cardResponseId: number;

  @ManyToOne(type => CardResponse, cardResponse => cardResponse.archives)
  @JoinColumn({ name: 'cardResponseId' })
  cardResponse: CardResponse;

  @Column() userId: string;

  @ManyToOne(type => User, user => user.archives)
  @JoinColumn({ name: 'userId' })
  user: User;
}
