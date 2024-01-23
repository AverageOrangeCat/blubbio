import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: AuthenticatedRequest) {
        return this.userService.findByUsername(req.user.username);
    }
}

export interface AuthenticatedRequest extends Request {
    user: {
      userId: number;
      username: string;
    };
  }