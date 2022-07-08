import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });

    console.log(`DATABASE_URL=${this.configService.get('DATABASE_URL')}`);
  }

  cleanDb() {
    const env = this.configService.get('NODE_ENV');
    console.log(`NODE_ENV=${env}`);

    if (env === 'e2e') {
      return this.$transaction([
        this.bookmark.deleteMany(),
        this.user.deleteMany()
      ]);
    } else {
      throw new Error('This method is only for testing');
    }
  }
}
