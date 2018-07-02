interface iBoxerOptions {
    debug: boolean
}

interface IBoxer {
    LoadImage(url: string): void;
}

class Boxer implements IBoxer {

    //canvas
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null;

    private _canvasW: number = 0;
    private _canvasH: number = 0;

    constructor(canvas: HTMLCanvasElement, options: iBoxerOptions) {
        this._canvas = canvas;
        this._canvasW=this._canvas.width;
        this._canvasH=this._canvas.height;
        
        this._context = this._canvas.getContext('2d');

        console.log(this._canvasW,this._canvasH);
        this.Init();

    }

    Init(): void {
        if (!this._canvas.hasAttribute('tabindex')) {
            this._canvas.setAttribute('tabindex', '1');
        }

        var patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        var patterContext = patternCanvas.getContext('2d');
        if (patterContext !== null && this._context !== null) {
            patterContext.fillStyle = "rgb(197, 197, 197)";
            patterContext.fillRect(0,0,10,10);
            patterContext.fillRect(10,10,20,20);
            
            var pattern = this._context.createPattern(patternCanvas, "repeat");
            this._context.rect(0, 0, this._canvasW, this._canvasH);
            this._context.fillStyle = pattern;
            this._context.fill();
        }
    }

    LoadImage(url: string): void {
        throw new Error("Method not implemented.");
    }
}