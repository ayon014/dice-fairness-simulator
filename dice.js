const readline = require('readline');
const { sha3_256 } = require('js-sha3');
const crypto = require('crypto');
class Die {
    constructor(faces) {
        if (!Array.isArray(faces) || faces.length !== 6) {
            throw new Error('Each die must have exactly 6 faces');
        }
        if (faces.some(face => !Number.isInteger(face))) {
            throw new Error('All face values must be integers');
        }
        this.faces = faces;
    }   
    getFaces() {
        return this.faces; 
    }
}
class DiceGame {
    constructor(dice) {
        this.dice = dice;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    static parseDice(args) {
        if (args.length < 3) {
            throw new Error('You need at least 3 dice to play. Example:\nnode dice.js 1,2,3,4,5,6 1,3,5,7,9,5 2,2,4,4,6,6');
        }
        return args.map((arg, index) => {
            const faces = arg.split(',').map(face => {
                const num = Number(face.trim());
                if (!Number.isInteger(num)) {
                    throw new Error(`Die ${index + 1}: Face values must be whole numbers. Found: ${face}`);
                }
                return num;
            });
            if (faces.length !== 6) {
                throw new Error(`Die ${index + 1}: Must have exactly 6 faces. Found: ${faces.length}`);
            }
            return new Die(faces);
        });
    }
    async printProbabilityTable() {
        const n = this.dice.length;
        console.log('\nProbability Table (Chance that Row Die beats Column Die):');
        const header = ['       ', ...this.dice.map((_, i) => `Die ${i+1}`)].join(' | ');
        console.log(header);
        console.log('-'.repeat(header.length));
        for (let i = 0; i < n; i++) {
            const row = [`Die ${i+1}`.padEnd(7)];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    row.push('  -   ');
                } else {
                    const winRate = this.calculateWinRate(this.dice[i], this.dice[j]);
                    row.push(`${winRate.toFixed(1)}%`.padStart(6));
                }
            }
            console.log(row.join(' | '));
        }
    }
    calculateWinRate(dieA, dieB) {
        let wins = 0;
        const facesA = dieA.getFaces();
        const facesB = dieB.getFaces();   
        for (const faceA of facesA) {
            for (const faceB of facesB) {
                if (faceA > faceB) wins++;
            }
        }
        return (wins / (facesA.length * facesB.length)) * 100;
    }
    async start() {
        try {
            console.log('Welcome to the Fair Dice Game!');
            await this.printProbabilityTable();       
            const userGoesFirst = await this.determineFirstMove();
            console.log(userGoesFirst ? '\nYou go first!' : '\nComputer goes first!');
            const userDie = await this.selectDie('You');
            const computerDie = this.selectDieForComputer();
            const userRoll = await this.rollDie(userDie, 'You');
            const computerRoll = await this.rollDie(computerDie, 'Computer');
            this.declareWinner(userRoll, computerRoll);
        } catch (e) {
            console.error('\nError:', e.message);
        } finally {
            this.rl.close();
        }
    }
    async determineFirstMove() {
        console.log('\nLet\'s decide who picks the die first...');
        const compRand = crypto.randomBytes(32);
        const commit = sha3_256(compRand);
        console.log('Computer commits with hash:', commit);   
        const userBit = await this.getValidInput(
            'Please pick a bit (0 or 1): ', 
            v => [0, 1].includes(+v) ? +v : null
        );
        console.log('Computer reveals:', compRand.toString('hex'));
        const compBit = compRand[31] & 1;
        const result = (compBit ^ userBit) === 0;
        console.log(`Result: ${compBit} XOR ${userBit} = ${compBit ^ userBit}`);
        return result;
    }
    async selectDie(playerLabel) {
        console.log(`\n${playerLabel}, it’s your turn to choose a die:`);
        this.dice.forEach((die, i) => {
            console.log(`  ${i + 1}: [${die.getFaces().join(', ')}]`);
        });   
        return await this.getValidInput(
            `Enter the number of the die you want (1-${this.dice.length}): `,
            v => {
                const n = parseInt(v);
                return n >= 1 && n <= this.dice.length ? this.dice[n - 1] : null;
            }
        );
    }
    selectDieForComputer() {
        const index = crypto.randomInt(this.dice.length);
        const die = this.dice[index];
        console.log(`Computer selects die ${index + 1}: [${die.getFaces().join(', ')}]`);
        return die;
    }
    async rollDie(die, playerLabel) {
        console.log(`\n${playerLabel} is rolling the die...`);
        const compRand = crypto.randomBytes(32);
        const commit = sha3_256(compRand);
        console.log('Commitment:', commit);   
        const userNum = await this.getValidInput(
            'Enter any number (used as part of the roll seed): ',
            v => !isNaN(+v) ? +v : null
        );
        console.log('Reveal:', compRand.toString('hex'));
        const seed = BigInt('0x' + compRand.toString('hex')) + BigInt(userNum);
        const rollIndex = Number(seed % BigInt(die.getFaces().length));
        const result = die.getFaces()[rollIndex];
        console.log(`${playerLabel} rolled: ${result}`);
        return result;
    }
    declareWinner(userRoll, compRoll) {
        console.log('\nFinal Results:');
        console.log(`You rolled: ${userRoll}`);
        console.log(`Computer rolled: ${compRoll}`);   
        if (userRoll > compRoll) console.log('Congratulations, you win!');
        else if (userRoll < compRoll) console.log('Computer wins! Better luck next time.');
        else console.log("It's a tie!");
    }
    async getValidInput(prompt, validator) {
        while (true) {
            const input = await new Promise(r => this.rl.question(prompt, r));
            const valid = validator(input);
            if (valid !== null) return valid;
            console.error('Invalid input, please try again.');
        }
    }
}
if (process.argv.length < 3) {
    console.error('Usage: node dice.js die1 die2 die3 ...');
    console.error('Example: node dice.js 1,2,3,4,5,6 1,3,5,7,9,5 2,2,4,4,6,6');
    process.exit(1);
}
try {
    const dice = DiceGame.parseDice(process.argv.slice(2));
    const game = new DiceGame(dice);
    game.start();
} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}