const crypto = require('crypto');
class FairnessMechanism {
    static async determineFirstMove(inputHandler) {
        console.log('\nLet\'s decide who picks the die first...');
        const secret = crypto.randomBytes(32).toString('hex');
        const commit = crypto.createHmac('sha256', 'fixed-key')
            .update(secret)
            .digest('hex');     
        console.log('Computer commitment:', commit);
        const userBit = await inputHandler.getValidInput(
            'Pick a bit (0 or 1): ',
            v => [0, 1].includes(+v) ? +v : null
        );
        console.log('Computer reveals:', secret);
        const compBit = secret[secret.length - 1] & 1; 
        const result = (compBit ^ userBit) === 0;
        console.log(`Computer bit: ${compBit}`);
        console.log(`Your bit: ${userBit}`);
        console.log(`Result: ${compBit} XOR ${userBit} = ${compBit ^ userBit}`);
        const verifyHmac = crypto.createHmac('sha256', 'fixed-key')
            .update(secret)
            .digest('hex');        
        console.log('HMAC Verification:', verifyHmac === commit ? '✅ Valid' : '❌ Invalid');   
        return result;
    }
}
module.exports = FairnessMechanism;