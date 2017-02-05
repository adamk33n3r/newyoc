export class Vector2 {
    constructor(public x: number, public y: number) {}

    public equals(vec: Vector2) {
        return this.x === vec.x && this.y === vec.y;
    }

    public toString() {
        return `x: ${this.x}, y: ${this.y}`;
    }
}
