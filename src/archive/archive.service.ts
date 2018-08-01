import { BadRequestException, Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POINT_REQUIRED_ARCHIVE } from '../common/config';
import { CardResponse } from '../response/card-response.entity';
import { User } from '../user/user.entity';
import { Archive } from './archive.entity';
import { CreateArchiveDto } from './dto/create-archive.dto';

@Component()
export class ArchiveService {
  constructor(
    @InjectRepository(Archive)
    private readonly archiveRepository: Repository<Archive>,
    @InjectRepository(CardResponse)
    private readonly cardResponseRepository: Repository<CardResponse>,
  ) {}

  async create(createArchiveDto: CreateArchiveDto, user: User) {
    const cardResponse = await this.cardResponseRepository.findOne(
      createArchiveDto.cardResponseId,
    );
    if (!cardResponse) {
      throw new BadRequestException();
    }

    if (user.point < POINT_REQUIRED_ARCHIVE) {
      throw new BadRequestException();
    }

    const existing = await this.archiveRepository.findOne({
      cardResponse,
      user,
    });
    if (existing) {
      throw new BadRequestException();
    }

    user.point -= POINT_REQUIRED_ARCHIVE;
    const archive = await this.archiveRepository.create({
      cardResponseId: cardResponse.id,
      userId: user.id,
      description: createArchiveDto.description,
    });

    return this.archiveRepository.manager.transaction(async tx => {
      const updatedUser = await tx.getRepository(User).save(user);
      const created = await tx.getRepository(Archive).save(archive);
      return {
        updatedUser,
        created,
      };
    });
  }

  async getRecent() {
    return this.archiveRepository.find({
      take: 6,
      order: { createTime: 'DESC' },
      relations: [
        'user',
        'cardResponse',
        'cardResponse.response',
        'cardResponse.response.user',
      ],
    });
  }
}
