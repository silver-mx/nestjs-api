import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AuthDto } from "src/dto";
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { domainToASCII } from 'url';


@Injectable()
export class AuthService {
    constructor(private dbService: DbService) {
    }

    async login(authDto: AuthDto): Promise<User> {

        const user = await this.dbService.user.findUnique({
            where: {
                email: authDto.email
            }
        });

        if (!user) {
            throw new BadRequestException('The user was not found or the password is incorrect');
        }

        const passMatches = await argon2.verify(user.hash, authDto.password);

        if (!passMatches) {
            throw new BadRequestException('The user was not found or the password is incorrect');
        }

        delete user.hash;

        return user;
    }

    async signup(authDto: AuthDto): Promise<User> {
        console.time();
        const hash = await argon2.hash(authDto.password, {
            type: argon2.argon2id,
            timeCost: 3,
            memoryCost: 37888,
            parallelism: 1,
            saltLength: 16,
            hashLength: 32,
        });
        console.timeEnd();

        try {
            const user = await this.dbService.user.create({
                data: {
                    email: authDto.email,
                    hash
                }
            });

            delete user.hash;

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    console.error(`Uniqe constraint error detected when signing up user: ${{ error }}`);
                    throw new ConflictException(`The email is already registered`);
                } else {
                    console.error(`Unexpected error detected when signing up user: ${{ error }}`);
                    throw new BadRequestException(error.message);
                }
            }
        }
    }
}
