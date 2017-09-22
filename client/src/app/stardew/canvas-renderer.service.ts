import { Vector2 } from './vector2';

type MousePosFn = (mousePos: Vector2) => void;

export class CanvasRenderer {
    public get Width() {
        return this.canvas.width;
    }

    public get Height() {
        return this.canvas.height;
    }

    protected context: CanvasRenderingContext2D;
    protected onMouseOverFn: MousePosFn;
    protected onMouseClickFn: MousePosFn;
    protected mouseMovePosCache: Vector2;

    constructor(protected canvas: HTMLCanvasElement, private scale = 1) {
        this.canvas.width = 77 * this.scale;
        this.canvas.height = 62 * this.scale;
        this.context = canvas.getContext('2d');
        this.context.scale(this.scale, this.scale);
        this.canvas.addEventListener('mousemove', (event) => {
            const mousePos = this.getMousePosition(event);
            const tilePos = this.getTilePos(mousePos);
            if (this.mouseMovePosCache && this.mouseMovePosCache.equals(tilePos)) {
                return;
            }
            this.mouseMovePosCache = tilePos;
            this.onMouseOverFn(tilePos);
        });
        this.canvas.addEventListener('mousedown', (event) => {
            const mousePos = this.getMousePosition(event);
            const tilePos = this.getTilePos(mousePos);
            this.onMouseClickFn(tilePos);
        });
    }

    public drawPixel(pos: Vector2, size = 1, color: string | CanvasGradient | CanvasPattern = 'black') {
        this.drawRect(pos.x, pos.y, size, size, color);
    }

    public drawRect(x: number, y: number, w: number, h: number, color: string | CanvasGradient | CanvasPattern = 'black') {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, w, h);
    }

    public clear() {
        this.context.clearRect(0, 0, this.Width, this.Height);
    }

    public onMouseOver(func: MousePosFn) {
        this.onMouseOverFn = func;
    }

    public onMouseClick(func: MousePosFn) {
        this.onMouseClickFn = func;
    }

    private getTilePos(mousePos: Vector2): Vector2 {
        return new Vector2(
            Math.floor(mousePos.x / this.scale),
            Math.floor(mousePos.y / this.scale),
        );
    }

    private getMousePosition(event: MouseEvent): Vector2 {
        const rect = this.canvas.getBoundingClientRect();
        return new Vector2(
            Math.floor(event.clientX - rect.left),
            Math.floor(event.clientY - rect.top),
        );
    }
}
