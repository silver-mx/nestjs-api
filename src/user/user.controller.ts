import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { EditUserDto } from './dto/edit-user-dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Get('me')
  getCurrentUser(@CurrentUser() user: User, @Req() _req: Request) {
    return user;
  }

  @Patch()
  editUser(@CurrentUser() user: User, @Body() editUserDto: EditUserDto) {
    return this.userService.editUser(user.id, editUserDto);
  }
}
