import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EditUserDto } from './dto/edit-user-dto';

@Injectable()
export class UserService {
  constructor(private dbService: DbService) {
  }

  async editUser(userId: number, editUserDto: EditUserDto) {
    const user = await this.dbService.user.update({
      where: {
        id: userId
      },
      data: {
        ...editUserDto
      }
    });

    delete user.hash;

    return user;
  }

}
