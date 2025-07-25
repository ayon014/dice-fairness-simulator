const ProbabilityTable = require('./ProbabilityTable');
const DieSelector = require('./DieSelector');
const DieRoller = require('./DieRoller');
const FairnessMechanism = require('./FairnessMechanism');
const InputHandler = require('./InputHandler');
class DiceGame {
    constructor(dice, inputHandler) {
        this.dice = dice;
        this.inputHandler = inputHandler;
        this.dieSelector = new DieSelector(dice, inputHandler);
        this.dieRoller = new DieRoller(inputHandler);
    }
    async start() {
        try {
            console.log('Welcome to the Fair Dice Game!');
            await this.printProbabilityTable();
            const userGoesFirst = await FairnessMechanism.determineFirstMove(this.inputHandler);
            console.log(userGoesFirst ? '\nYou go first!' : '\nComputer goes first!');
            const userDie = await this.dieSelector.selectForUser('You');
            const computerDie = this.dieSelector.selectForComputer();
            const userRoll = await this.dieRoller.roll(userDie, 'You');
            const computerRoll = await this.dieRoller.roll(computerDie, 'Computer');          
            this.declareWinner(userRoll, computerRoll);
        } catch (e) {
            console.error('\nError:', e.message);
        } finally {
            this.inputHandler.close();
        }
    }
    async printProbabilityTable() {
        const table = new ProbabilityTable(this.dice);
        table.printTable();
    }
    declareWinner(userRoll, compRoll) {
        console.log('\nFinal Results:');
        console.log(`You rolled: ${userRoll}`);
        console.log(`Computer rolled: ${compRoll}`);
        if (userRoll > compRoll) console.log('You win!');
        else if (userRoll < compRoll) console.log('Computer wins!');
        else console.log("It's a tie!");
    }
}
module.exports = DiceGame;