import { Controller, Get, UseGuards, Post, Body, Request } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { GameStatsDto } from './dto/dto.game-stats';

@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitGameStats(@Request() req, @Body() gameStatsDto: GameStatsDto) {
    return await this.sprintService.saveGameStats(req.userId, gameStatsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderboard() {
    return await this.sprintService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Get('userHistory')
  async getUserHistory(@Request() req) {
    return await this.sprintService.getUserHistory(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('personalBests')
  async getPersonalBests(@Request() req) {
    return await this.sprintService.getPersonalBests(req.user.userId);
  }
}
