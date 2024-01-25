import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from './lobby/lobby.gateway';
import { GameGateway } from './game/game.gateway';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  providers: [LobbyGateway, GameGateway],
})
export class AppModule { }
