const Die = require('./Die');
class DiceParser {
    static parse(args) {
        if (args.length < 3) {
            throw new Error('You need at least 3 dice to play');
        }
        return args.map((arg, index) => {
            const faces = arg.split(',').map(face => {
                const num = Number(face.trim());
                if (!Number.isInteger(num)) {
                    throw new Error(`Die ${index + 1}: Face values must be whole numbers`);
                }
                return num;
            });           
            if (faces.length !== 6) {
                throw new Error(`Die ${index + 1}: Must have exactly 6 faces`);
            }            
            return new Die(faces);
        });
    }
}
module.exports = DiceParser;