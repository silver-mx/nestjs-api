import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto) {
    console.log('Login=', authDto);
    return this.authService.login(authDto);
  }

}
