import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
