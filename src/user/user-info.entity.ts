import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserInfo {
  @PrimaryColumn() id: string;

  @OneToOne(type => User, user => user.info)
  @JoinColumn({ name: 'id' })
  user: User;

  @Column() point: number;
}
