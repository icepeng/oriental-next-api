import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Component()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async saveUser(info: { id: string; battletag: string }) {
    const existingUser = await this.userRepository.findOne(info.id);
    if (existingUser) {
      if (existingUser.battletag !== info.battletag) {
        return this.userRepository.save(existingUser);
      }
      return existingUser;
    }
    const user = this.userRepository.create({
      id: info.id,
      battletag: info.battletag,
      point: 0,
    });
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOne(id, {
      relations: [
        'responses',
        'responses.cardResponses',
        'responses.expansionResponse',
      ],
    });
  }
}
