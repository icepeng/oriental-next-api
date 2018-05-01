import { BadRequestException } from '@nestjs/common';
import { Column } from 'typeorm';

export class UserPoint {
  @Column({ default: 0 })
  amount: number;

  increment(amount: number) {
    this.amount += amount;
  }

  decrement(amount: number) {
    if (this.amount < amount) {
      throw new BadRequestException();
    }
  }
}
