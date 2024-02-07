import { Body, Controller, Post, Headers, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto.login';
import { RegisterDto } from './dto/auth.dto.register';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
        return this.authService.register(registerDto, this.authService.getClientIp(req));
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(@Headers('Authorization') token: string) {
        if(token){
            return this.authService.logout(token.replace('Bearer ', ''));
        }
    }
}
