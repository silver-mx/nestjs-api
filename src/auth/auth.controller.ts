import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post("login")
    login(@Body() authDto: AuthDto) {
        console.log('Login=', authDto);
        return this.authService.login(authDto);
    }

    @Post("signup")
    signup(@Body() authDto: AuthDto) {
        return this.authService.signup(authDto);
    }
}
