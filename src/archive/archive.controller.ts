import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../common/auth.decorator';
import { User } from '../user/user.entity';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';

@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}
  @Post()
  public async create(
    @Auth() user: User,
    @Body() createArchiveDto: CreateArchiveDto,
  ) {
    const { created, updatedUser } = await this.archiveService.create(
      createArchiveDto,
      user,
    );
    return {
      id: created.id,
      point: updatedUser.point,
    };
  }
}
