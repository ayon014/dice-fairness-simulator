const crypto = require('crypto');
class DieSelector {
    constructor(dice, inputHandler) {
        this.dice = dice;
        this.inputHandler = inputHandler;
    }
    async selectForUser(playerLabel) {
        console.log(`\n${playerLabel}, choose a die:`);
        this.dice.forEach((die, i) => {
            console.log(`  ${i + 1}: [${die.getFaces().join(', ')}]`);
        });
        return await this.inputHandler.getValidInput(
            `Enter the number of the die you want (1-${this.dice.length}): `,
            v => {
                const n = parseInt(v);
                return n >= 1 && n <= this.dice.length ? this.dice[n - 1] : null;
            }
        );
    }
    selectForComputer() {
        const index = crypto.randomInt(this.dice.length);
        const die = this.dice[index];
        console.log(`Computer selects die ${index + 1}: [${die.getFaces().join(', ')}]`);
        return die;
    }
}
module.exports = DieSelector;