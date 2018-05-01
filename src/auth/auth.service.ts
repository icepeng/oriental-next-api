import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

// tslint:disable-next-line:no-var-requires
const Secret = require('../../secrets/secret.json');

@Component()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createToken(user: { id: string; battletag: string }) {
    const expiresIn = '1d';
    const info = { id: user.id, battletag: user.battletag };
    const token = jwt.sign(info, Secret.jwtSecret, { expiresIn });
    return token;
  }

  async validateUser(user: { id: string; battletag: string }) {
    return this.userRepository.findOne(user.id);
  }
}
