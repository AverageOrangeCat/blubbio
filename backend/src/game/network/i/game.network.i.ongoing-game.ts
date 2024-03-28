import { GameInstance } from "src/game/i/game.i.game-instance";
import { Socket } from 'socket.io';
import { InputFrame } from "src/game/i/game.i.game-state-history";

export interface OngoingGame {
    playerClient: Socket,
    playerName: string,
    gameInstance: GameInstance,
    playerSpectators: string,
    queuedInputs: InputFrame[],
    isProcessing: boolean,
}