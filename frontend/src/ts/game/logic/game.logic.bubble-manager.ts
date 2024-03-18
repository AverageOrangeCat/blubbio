import { convertSeedToRandomNumber, getNextSeed } from "./game.logic.random";
import { Bubble } from "../i/game.i.bubble";
import { GameInstance } from "../i/game.i.game-instance";
import { addGarbageToGrid } from "./game.logic.grid-manager";

export function holdBubble(gameInstance: GameInstance): void {
    if (!gameInstance.holdBubble) {
        const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, gameInstance.bubbleSeed);
        gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
        gameInstance.bubbleQueue.push(allBubbles[randomIndex]);
        gameInstance.holdBubble = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
    } else {
        const temp = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.holdBubble as Bubble;
        gameInstance.holdBubble = temp;
    }
}

export function updateBubbleQueueAndCurrent(gameInstance: GameInstance): void {
    const queueLength = gameInstance.gameSettings.queuePreviewSize.value;
    while (gameInstance.bubbleQueue.length <= queueLength) {
        gameInstance.bubbleQueue.push(...getBubbleBag(gameInstance));
    }
    gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
}

export function receiveGarbage(gameInstance: GameInstance): void {
    if (gameInstance.queuedGarbage > 0) {
        const colors = selectColors();
        const maxAtOnce = gameInstance.gameSettings.garbageMaxAtOnce.value;
        for (let i = 0; i < maxAtOnce; i++) {
            const garbage = generateGarbage(colors);
            addGarbageToGrid(garbage, gameInstance.playGrid);
            gameInstance.queuedGarbage--;
            checkIfGarbageKills(gameInstance);
            if (gameInstance.queuedGarbage === 0) {
                break;
            }
        }
    }

    function selectColors(): Bubble[] {
        const colorAmount = gameInstance.gameSettings.garbageColorAmount.value;
        const leftOverBubbles = [...allBubbles];
        const chosenColors: Bubble[] = [];
        for (let i = 0; i < colorAmount; i++) {
            const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.garbageSeed);
            gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
            chosenColors.push(leftOverBubbles.splice(randomIndex, 1)[0]);
        }

        return chosenColors;
    }

    function generateGarbage(colorSelection: Bubble[]): Bubble[] {
        const garbageRow: Bubble[] = [];
        const garbageIsSmallRow = !gameInstance.playGrid.rows[0].isSmallerRow
        const rowLength = gameInstance.playGrid.gridWidth - (garbageIsSmallRow ? 1 : 0);

        const cleanAmount = gameInstance.gameSettings.garbageCleanAmount.value;
        const cleanColorLocation = convertSeedToRandomNumber(0, rowLength-cleanAmount+1, gameInstance.garbageSeed);
        gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
        const randomCleanColorIndex = convertSeedToRandomNumber(0, colorSelection.length, gameInstance.garbageSeed);
        gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
        const cleanColor = colorSelection.splice(randomCleanColorIndex, 1)[0];
        for (let j = 0; j <= rowLength-cleanAmount; j++) {
            if (cleanColorLocation === j) {
                for (let k = 0; k < cleanAmount; k++) {
                    garbageRow.push(cleanColor);
                }
            } else {
                const randomColorIndex = convertSeedToRandomNumber(0, colorSelection.length, gameInstance.garbageSeed);
                gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
                garbageRow.push(colorSelection[randomColorIndex]);
            }
        }
        colorSelection.push(cleanColor);
        return garbageRow;
    }

    function checkIfGarbageKills(gameInstance: GameInstance): void {
        const lastNonDeathRow = gameInstance.playGrid.rows[gameInstance.playGrid.rows.length - 1 - gameInstance.playGrid.extraGridHeight];
        let dead = true;
        lastNonDeathRow.fields.forEach(field => {
            if (field.bubble === undefined) {
                dead = false;
            }
        });
        if (dead) {
            gameInstance.gameTransitions.onGameDefeat();
        }
    }
}

function getBubbleBag(gameInstance: GameInstance): Bubble[] {
    const bagSize = gameInstance.gameSettings.bubbleBagSize.value;
    const bag: Bubble[] = [];
    const leftOverBubbles = [...allBubbles];
    while (bag.length < bagSize) {
        if (leftOverBubbles.length === 0) {
            leftOverBubbles.push(...allBubbles);
        }
        const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.bubbleSeed);
        bag.push(leftOverBubbles.splice(randomIndex, 1)[0]);
        gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
    }
    return bag;
}


const red: Bubble = {
    color: "rgb(255, 0, 0)",
    ascii: `<span style="color: rgb(255, 0, 0);">R</span>`,
    type: 0,
}
const orange: Bubble = {
    color: "rgb(255, 174, 0)",
    ascii: `<span style="color: rgb(255, 174, 0);">O</span>`,
    type: 1,
}
const yellow: Bubble = {
    color: "rgb(255, 255, 0)",
    ascii: `<span style="color: rgb(255, 255, 0);">Y</span>`,
    type: 2,
}
const green: Bubble = {
    color: "rgb(123, 255, 0)",
    ascii: `<span style="color: rgb(123, 255, 0);">G</span>`,
    type: 3,
}
const cyan: Bubble = {
    color: "rgb(0, 255, 255)",
    ascii: `<span style="color: rgb(0, 255, 255);">B</span>`,
    type: 4,
}
const magenta: Bubble = {
    color: "rgb(255, 0, 255)",
    ascii: `<span style="color: rgb(255, 0, 255);">P</span>`,
    type: 5,
}
const white: Bubble = {
    color: "rgb(255, 255, 255)",
    ascii: `<span style="color: rgb(255, 255, 255);">W</span>`,
    type: 6,
}
const allBubbles: Bubble[] = [
    red,
    orange,
    yellow,
    green,
    cyan,
    magenta,
    white,
]