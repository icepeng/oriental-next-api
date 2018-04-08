import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAll() {
    const users = await this.userService.findAll();
    return {
      users,
    };
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      user,
    };
  }
}
