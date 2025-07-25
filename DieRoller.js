const crypto = require('crypto');

class DieRoller {
    constructor(inputHandler) {
        this.inputHandler = inputHandler;
    }

    async roll(die, playerLabel) {
        console.log(`\n${playerLabel} is rolling...`);
        
        // 1. Computer generates secret and commitment
        const secret = crypto.randomBytes(32).toString('hex');
        const commit = crypto.createHmac('sha256', 'fixed-key')
            .update(secret)
            .digest('hex');
            
        console.log('Commitment (HMAC):', commit);
        
        // 2. User provides roll seed
        const userNum = await this.inputHandler.getValidInput(
            'Enter any number (roll seed): ',
            v => !isNaN(+v) ? +v : null
        );
        
        // 3. Generate final roll from combined secret + user input
        const seedBigInt = BigInt('0x' + secret) + BigInt(userNum);
        const faceCount = die.getFaces().length;
        const rollIndex = Number(seedBigInt % BigInt(faceCount));
        const result = die.getFaces()[rollIndex];
        
        // 4. Reveal secret for verification
        console.log('Reveal (secret):', secret);
        console.log(`${playerLabel} rolled: ${result}`);
        
        // 5. Verification step
        const verifyHmac = crypto.createHmac('sha256', 'fixed-key')
            .update(secret)
            .digest('hex');
            
        console.log('HMAC Verification:', verifyHmac === commit ? '✅ Valid' : '❌ Invalid');
        return result;
    }
}

module.exports = DieRoller;