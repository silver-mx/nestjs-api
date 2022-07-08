import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark-dto';
import { EditBookmarkDto } from './dto/edit-bookmark-dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

  constructor(private bookmarkService: BookmarkService) {
  }

  @Get()
  getBookmarks(@CurrentUser() user: User) {
    return this.bookmarkService.findAll(user.id);
  }

  @Get(':id')
  getBookmarkById(@CurrentUser() _user: User, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.findById(bookmarkId);
  }

  @Post()
  createBookmark(@CurrentUser() user: User, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.create(user.id, dto);
  }

  @Patch(':id')
  editBookmark(@CurrentUser() user: User, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkDto) {
    return this.bookmarkService.edit(user.id, bookmarkId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmark(@CurrentUser() user: User, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.delete(user.id, bookmarkId);
  }

}
