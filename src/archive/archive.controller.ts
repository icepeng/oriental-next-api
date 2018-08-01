import { Body, Controller, Post, Get } from '@nestjs/common';
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

  @Get('recent')
  public async getRecent() {
    const archives = await this.archiveService.getRecent();
    return {
      archives,
    };
  }
}
