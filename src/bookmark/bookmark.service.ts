import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBookmarkDto } from './dto/create-bookmark-dto';
import { EditBookmarkDto } from './dto/edit-bookmark-dto';

@Injectable()
export class BookmarkService {

  constructor(private dbService: DbService) {
  }

  create(userId: number, dto: CreateBookmarkDto) {
    return this.dbService.bookmark.create({
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
        userId
      }
    });
  }

  findAll(userId: number) {
    return this.dbService.bookmark.findMany({
      where: {
        userId
      }
    });
  }

  findById(bookmarkId: number) {
    return this.dbService.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    });
  }

  async edit(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    await this.findBookmarkAndVerifyUserId(userId, bookmarkId);

    return this.dbService.bookmark.update({
      where: {
        id: bookmarkId
      },
      data: {
        ...dto
      }
    });
  }

  private async findBookmarkAndVerifyUserId(userId: number, bookmarkId: number) {
    const bookmark = await this.dbService.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException('The bookmark has not been found');
    }
  }

  async delete(userId: number, bookmarkId: number) {
    await this.findBookmarkAndVerifyUserId(bookmarkId, userId);
    return this.dbService.bookmark.delete({
      where: {
        id: bookmarkId
      }
    });
  }
}
