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
module.exports = Die;