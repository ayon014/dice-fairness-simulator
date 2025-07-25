const Table = require('cli-table3');

class ProbabilityTable {
    constructor(dice) {
        this.dice = dice;
    }
    printTable() {
        console.log('\nProbability Table (Chance that Row Die beats Column Die):');

        const table = new Table({
            head: ['       ', ...this.dice.map((_, i) => `Die ${i+1}`)],
            colWidths: [10, 10, 10, 10, 10]
        });
        for (let i = 0; i < this.dice.length; i++) {
            const row = [`Die ${i+1}`.padEnd(7)];
            for (let j = 0; j < this.dice.length; j++) {
                if (i === j) {
                    row.push('  -   ');
                } else {
                    const winRate = this.calculateWinRate(this.dice[i], this.dice[j]);
                    row.push(`${winRate.toFixed(1)}%`.padStart(6));
                }
            }
            table.push(row);
        }     
        console.log(table.toString());
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
}
module.exports = ProbabilityTable;