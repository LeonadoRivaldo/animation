function generateRandomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function makeDiceRoll(playString) {
    const play = playString.split('d');
    const rolls = play[0];
    const dice = `d${play[1]}`;

    return Array.from({ length: rolls }).map(r => Dices[dice]());
}
function rollDice(dice) {
    return generateRandomInteger(dice);
}

const DICES = [4, 6, 8, 10, 12, 20];
const generateDefaultDices = (prev, next) => ({ ...prev, [`d${next}`]: () => rollDice(next) });
const Dices = DICES.reduce(generateDefaultDices, {});