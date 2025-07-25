const readline = require('readline');
class InputHandler {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    async getValidInput(prompt, validator) {
        while (true) {
            const input = await new Promise(r => this.rl.question(prompt, r));
            const valid = validator(input);
            if (valid !== null) return valid;
            console.error('Invalid input, please try again.');
        }
    }
    close() {
        this.rl.close();
    }
}
module.exports = InputHandler;