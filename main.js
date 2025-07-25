const DiceParser = require('./DiceParser');
const DiceGame = require('./DiceGame');
const InputHandler = require('./InputHandler');

if (process.argv.length < 3) {
    console.error('Usage: node index.js die1 die2 die3 ...');
    console.error('Example: node index.js 1,2,3,4,5,6 1,3,5,7,9,5 2,2,4,4,6,6');
    process.exit(1);
}

try {
    const dice = DiceParser.parse(process.argv.slice(2));
    const inputHandler = new InputHandler();
    const game = new DiceGame(dice, inputHandler);
    game.start();
} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}