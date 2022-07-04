import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient {

    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://postgres:password1@localhost:5434/nest?schema=public'
                }
            }
        });
    }
}
