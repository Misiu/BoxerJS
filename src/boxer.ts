class EventEmitter {
    private _e: any;

    public on(event: string, callback: Function, ctx?: any) {
        const e = this._e || (this._e = {});

        (e[event] || (e[event] = [])).push({
            fn: callback,
            ctx: ctx
        });

        return this;
    }
    public off(event: string, callback: Function) {
        const e = this._e || (this._e = {});
        const evts = e[event];
        const liveEvents = [];

        if (evts && callback) {
            for (let i = 0, len = evts.length; i < len; i++) {
                if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
                    liveEvents.push(evts[i]);
                }
            }
        }

        // remove event from queue to prevent memory leak
        // suggested by https://github.com/lazd
        // sef: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

        (liveEvents.length)
            ? e[name] = liveEvents
            : delete e[name];

        return this;
    }

    public emit(event: string, ...args: any[]) {
        const data = [].slice.call(args, 1);
        const evtArr = ((this._e || (this._e = {}))[event] || []).slice();
        let i = 0;
        const len = evtArr.length;

        for (i; i < len; i++) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }

        return this;
    }
}



interface IPoint {
    x: number;
    y: number;
}

interface IBoxerOptions {
    responsive: boolean;
    debug: boolean;
    readonly: boolean;
}

interface IBoxer {
    LoadImage(url: string): void;
}

class Box {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    public fill: string;

    private _adornerWidth: number = 6;
    private _adorners: Box[] | undefined;

    constructor(x: number, y: number, w: number, h: number, fill: string, adorner: boolean = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.fill = fill;
        if (adorner) { return; }
        this._adorners = new Array<Box>();

        // 0  1  2
        // 7     3
        // 6  5  4

        /*         ctx.fillRect(this.x - width / 2, this.y - width / 2, width, width);
                //1
                ctx.fillRect(this.x + this.w / 2 - width / 2, this.y - width / 2, width, width);
                //2
                ctx.fillRect(this.x + this.w - width / 2, this.y - width / 2, width, width);
                //3
                ctx.fillRect(this.x + this.w - width / 2, this.y + this.h / 2 - width / 2, width, width);
                //4
                ctx.fillRect(this.x + this.w - width / 2, this.y + this.h - width / 2, width, width);
                //5
                ctx.fillRect(this.x + this.w / 2 - width / 2, this.y + this.h - width / 2, width, width);
                //6
                ctx.fillRect(this.x - width / 2, this.y + this.h - width / 2, width, width);
                //7
                ctx.fillRect(this.x - width / 2, this.y + this.h / 2 - width / 2, width, width); */

        this._adorners.push(new Box(this.x - this._adornerWidth / 2, this.y - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w / 2 - this._adornerWidth / 2, this.y - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w - this._adornerWidth / 2, this.y - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w - this._adornerWidth / 2, this.y + h / 2 - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w - this._adornerWidth / 2, this.y + h - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w / 2 - this._adornerWidth / 2, this.y + h - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x - this._adornerWidth / 2, this.y + h - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x - this._adornerWidth / 2, this.y + h / 2 - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));

    }

    public Contains(x: number, y: number): boolean {
        return (this.x <= x) && (this.x + this.w >= x) && (this.y <= y) && (this.y + this.h >= y);
    }

    public GetResizeDirection(x: number, y: number): number {
        if (this._adorners === undefined) { return -1; }
        for (let i = 0, len = this._adorners.length; i < len; i++) {
            if (this._adorners[i].Contains(x, y)) {
                return i;
            }
        }
        // default
        return -1;
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    public UpdateAdornersPosition(): any {
        if (this._adorners === undefined) { return; }

        // 0  1  2
        // 7     3
        // 6  5  4

        // 0
        this._adorners[0].x = this.x - this._adornerWidth / 2;
        this._adorners[0].y = this.y - this._adornerWidth / 2;
        // 1
        this._adorners[1].x = this.x + this.w / 2 - this._adornerWidth / 2;
        this._adorners[1].y = this.y - this._adornerWidth / 2;
        // 2
        this._adorners[2].x = this.x + this.w - this._adornerWidth / 2;
        this._adorners[2].y = this.y - this._adornerWidth / 2;
        // 3
        this._adorners[3].x = this.x + this.w - this._adornerWidth / 2;
        this._adorners[3].y = this.y + this.h / 2 - this._adornerWidth / 2;
        // 4
        this._adorners[4].x = this.x + this.w - this._adornerWidth / 2;
        this._adorners[4].y = this.y + this.h - this._adornerWidth / 2;
        // 5
        this._adorners[5].x = this.x + this.w / 2 - this._adornerWidth / 2;
        this._adorners[5].y = this.y + this.h - this._adornerWidth / 2;
        // 6
        this._adorners[6].x = this.x - this._adornerWidth / 2;
        this._adorners[6].y = this.y + this.h - this._adornerWidth / 2;
        // 7
        this._adorners[7].x = this.x - this._adornerWidth / 2;
        this._adorners[7].y = this.y + this.h / 2 - this._adornerWidth / 2;

    }

    public DrawAdorners(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = '#CC0000';

        if (this._adorners === undefined) { return; }

        this.UpdateAdornersPosition();
        for (const adorner of this._adorners) {
            adorner.Draw(ctx);
        }

        // 0  1  2
        // 7     3
        // 6  5  4

        /*         //0
                var width = 6;
                ctx.fillRect(this.x - width / 2, this.y - width / 2, width, width);
                //1
                ctx.fillRect(this.x + this.w / 2 - width / 2, this.y - width / 2, width, width);
                //2
                ctx.fillRect(this.x + this.w - width / 2, this.y - width / 2, width, width);
                //3
                ctx.fillRect(this.x + this.w - width / 2, this.y + this.h / 2 - width / 2, width, width);
                //4
                ctx.fillRect(this.x + this.w - width / 2, this.y + this.h - width / 2, width, width);
                //5
                ctx.fillRect(this.x + this.w / 2 - width / 2, this.y + this.h - width / 2, width, width);
                //6
                ctx.fillRect(this.x - width / 2, this.y + this.h - width / 2, width, width);
                //7
                ctx.fillRect(this.x - width / 2, this.y + this.h / 2 - width / 2, width, width);
         */
    }


}

class Boxer extends EventEmitter implements IBoxer {
    // canvas
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    private _canvasW: number = 0;
    private _canvasH: number = 0;

    // ptions
    private _options: IBoxerOptions;

    private _originalImageW: number = 0;
    private _originalImageH: number = 0;

    private _imgX: number = 0;
    private _imgY: number = 0;
    private _imgW: number = 0;
    private _imgH: number = 0;

    private _needRepaint: boolean = false;

    private _selectedBox: Box | undefined;
    private _dragging: boolean = false;

    private _dragoffx: number = 0;
    private _dragoffy: number = 0;

    private _resizing: boolean = false;

    private _resizeoffx: number = 0;
    private _resizeoffy: number = 0;

    private _resizeDirection: number = -1;

    private _boxes: Box[] = new Array<Box>();

    private _image: HTMLImageElement | undefined;
    private _drawImage: boolean = false;
    private _imageLoading: boolean = false;
    private _imageLoadingProgress: number = 0;

    constructor(canvas: HTMLCanvasElement, options: IBoxerOptions | null) {

        super();

        if (!(canvas instanceof HTMLCanvasElement)) { throw new Error('You must pass Canvas as first argument!'); }
        this._canvas = canvas;
        const ctx = this._canvas.getContext('2d');
        if (ctx === null) { throw new Error('Unable to get context from Canvas.'); }
        this._context = ctx;

        this._canvasW = this._canvas.width;
        this._canvasH = this._canvas.height;

        this._options = {
            debug: false,
            readonly: false,
            responsive: false
        };
        this._options = { ...this._options, ...options };

        this.SetupCanvasAttributes();
        this.AttachEventHandlers();
        this.Render();
    }

    public LoadImage(url: string): void {

        this._image = new Image();

        // https://stackoverflow.com/questions/14218607/javascript-loading-progress-of-an-image
        const xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET', url, true);
        xmlHttpRequest.responseType = 'arraybuffer';

        xmlHttpRequest.onload = () => {
            const h = xmlHttpRequest.getAllResponseHeaders();
            const m = h.match(/^Content-Type\:\s*(.*?)$/mi);
            if (m !== null) {
                const mimeType = m[1] || 'image/png';
                // Remove your progress bar or whatever here. Load is done.

                const blob = new Blob([xmlHttpRequest.response], { type: mimeType });

                if (this._image !== undefined) {
                    this._image.src = window.URL.createObjectURL(blob);
                    setTimeout(() => {
                        this._drawImage = true;
                        this._imageLoading = false;
                        this._needRepaint = true;
                    }, 5);
                }
            }
        };

        xmlHttpRequest.onprogress = (e) => {
            if (e.lengthComputable) {
                const completedPercentage = (e.loaded / e.total) * 100;
                // console.log(completedPercentage + ' %');
                this._imageLoadingProgress = completedPercentage;
                this._needRepaint = true;
            }
        };

        xmlHttpRequest.onloadstart = () => {
            // console.log(0 + ' %');
            this._needRepaint = true;
        };

        xmlHttpRequest.onloadend = () => {
            // console.log('sto');
            this._imageLoading = false;
            this._needRepaint = true;
            this.emit('imageLoaded');
        };

        xmlHttpRequest.onerror = (e) => {
            // console.log(e);
        };

        xmlHttpRequest.send();
        this._imageLoading = true;
        this._imageLoadingProgress = 0;


        /*
                this._image = new Image();
                this._image.onload = () => {
                    if (this._image !== undefined)
                        this._drawImage = true;
                    this._needRepaint = true;
                };
                this._drawImage = false;
                this._needRepaint = true;
                this._image.src = url;
                */
    }

    public LoadBoxes(boxes: Box[]): void {
        // console.log(boxes);
        for (const box of boxes) {
            this.AddBox(new Box(box.x, box.y, box.w, box.h, 'rgba(0,255,0,.6)'));
        }
    }

    public GetBoxes(): Box[] {
        return this._boxes;
    }

    private SetupCanvasAttributes(): void {
        if (!this._canvas.hasAttribute('tabindex')) {
            this._canvas.setAttribute('tabindex', '1');
        }
        // this._needRepaint = true;
    }

    private AttachEventHandlers(): void {
        this._canvas.addEventListener('mousedown', (event) => {
            const pos = this.GetMousePosition(event);
            for (const box of this._boxes) {

                this._resizeDirection = box.GetResizeDirection(pos.x, pos.y);
                // console.log(this._resizeDirection);
                if (this._resizeDirection !== -1) {
                    this._selectedBox = box;
                    this._resizeoffx = pos.x - this._selectedBox.x;
                    this._resizeoffy = pos.y - this._selectedBox.y;
                    this._resizing = true;
                    return;
                }

                if (box.Contains(pos.x, pos.y)) {
                    this._selectedBox = box;
                    this._dragoffx = pos.x - this._selectedBox.x;
                    this._dragoffy = pos.y - this._selectedBox.y;
                    this._dragging = true;
                    this._needRepaint = true;
                    return;
                }
            }

            // remove selection
            if (this._selectedBox !== undefined) {
                this._selectedBox = undefined;
                this._needRepaint = true;
            }
        }, true);

        this._canvas.addEventListener('mousemove', (event) => {

            // console.log('dragging', this._dragging);
            // console.log('resizing', this._resizing);
            if (this._dragging && this._selectedBox !== undefined) {
                const position = this.GetMousePosition(event);
                // We don't want to drag the object by its top-left corner, we want to drag it
                // from where we clicked. Thats why we saved the offset and use it here
                this._selectedBox.x = position.x - this._dragoffx;
                this._selectedBox.y = position.y - this._dragoffy;
                this._needRepaint = true;
                return;
            }

            const pos = this.GetMousePosition(event);

            // console.log('było', this._resizeDirection);
            if (this._resizeDirection === -1) {
                for (const box of this._boxes) {

                    // 0  1  2
                    // 7     3
                    // 6  5  4

                    const rd = box.GetResizeDirection(pos.x, pos.y);
                    // console.log('jest', rd);
                    switch (rd) {
                        case 0:
                            this._canvas.style.cursor = 'nw-resize';
                            break;
                        case 1:
                            this._canvas.style.cursor = 'n-resize';
                            break;
                        case 2:
                            this._canvas.style.cursor = 'ne-resize';
                            break;
                        case 3:
                            this._canvas.style.cursor = 'w-resize';
                            break;
                        case 4:
                            this._canvas.style.cursor = 'se-resize'; // 'e-resize';
                            break;
                        case 5:
                            this._canvas.style.cursor = 's-resize';
                            break;
                        case 6:
                            this._canvas.style.cursor = 'sw-resize';
                            break;
                        case 7:
                            this._canvas.style.cursor = 'e-resize';
                            break;
                        default:
                            this._canvas.style.cursor = 'auto';
                            break;
                    }

                    if (rd !== -1) { break; }
                }
            }

            if (this._resizing && this._selectedBox !== undefined) {

                const oldx = this._selectedBox.x;
                const oldy = this._selectedBox.y;
                switch (this._resizeDirection) {
                    case 0:
                        this._selectedBox.x = pos.x;
                        this._selectedBox.y = pos.y;
                        this._selectedBox.w += oldx - pos.x;
                        this._selectedBox.h += oldy - pos.y;
                        this._needRepaint = true;
                        break;
                    case 1:
                        this._selectedBox.y = pos.y;
                        this._selectedBox.h += oldy - pos.y;
                        this._needRepaint = true;
                        break;
                    case 2:
                        this._selectedBox.y = pos.y;
                        this._selectedBox.w = pos.x - oldx;
                        this._selectedBox.h += oldy - pos.y;
                        this._needRepaint = true;
                        break;
                    case 3:
                        this._selectedBox.w = pos.x - oldx;
                        this._needRepaint = true;
                        break;
                    case 4:
                        this._selectedBox.w = pos.x - oldx;
                        this._selectedBox.h = pos.y - oldy;
                        this._needRepaint = true;
                        break;
                    case 5:
                        this._selectedBox.h = pos.y - oldy;
                        this._needRepaint = true;
                        break;
                    case 6:
                        this._selectedBox.x = pos.x;
                        this._selectedBox.w += oldx - pos.x;
                        this._selectedBox.h = pos.y - oldy;
                        this._needRepaint = true;
                        break;
                    case 7:
                        this._selectedBox.x = pos.x;
                        this._selectedBox.w += oldx - pos.x;
                        this._needRepaint = true;
                        break;
                    default:
                        this._canvas.style.cursor = 'auto';
                        break;
                }
            }
        }, true);

        this._canvas.addEventListener('mouseup', (event) => {
            this._dragging = false;
            this._resizing = false;
            this._resizeDirection = -1;
        }, true);

        this._canvas.addEventListener('mouseleave', (event) => {
            this._dragging = false;
            this._resizing = false;
            // this._selectedBox=undefined;
            this._needRepaint = true;
        }, true);

        this._canvas.addEventListener('mousewheel', (event) => {
            // console.log(event);
            event.preventDefault();
            return false;
        }, true);

        this._canvas.addEventListener('keydown', (event) => {
            if (event.keyCode === 46 /*Del*/ && this._selectedBox !== undefined && !this._dragging) {
                this.RemoveSelectedBox();
            }
        }, true);

        this._canvas.addEventListener('dblclick', (event) => {
            const pos = this.GetMousePosition(event);
            this.AddBox(new Box(pos.x - 10, pos.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
        }, true);

        this._canvas.addEventListener('selectstart', (event) => {
            // event.preventDefault();
            return false;
        }, true);

        this._canvas.onselectstart = () => {
            return false;
        };

        if (this._options.responsive) {
            window.addEventListener('resize', this.HandleResize);
            this.HandleResize();
        }
    }

    // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    private GetMousePosition(event: MouseEvent): IPoint {
        const rect = this._canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private AddBox(box: Box) {
        this._boxes.push(box);
        this._needRepaint = true;
    }

    private RemoveSelectedBox(): void {
        if (this._selectedBox === undefined) { return; }
        const index = this._boxes.indexOf(this._selectedBox);
        if (index > -1) {
            this._boxes.splice(index, 1);
        }
        this._selectedBox = undefined;
        this._needRepaint = true;
    }

    // tslint:disable-next-line:variable-name
    private Render = () => {
        if (this._context === null) { return; }

        if (!this._needRepaint) {
            requestAnimationFrame(this.Render);
            return;
        }

        this.ClearContext();


        if (this._imageLoading && this._context !== null) {
            this._context.fillStyle = 'rgb(197, 197, 197)';
            this._context.strokeStyle = 'rgb(197, 197, 197)';
            this._context.lineWidth = 1;

            const centerX: number = this._canvasW / 2;
            const centerY: number = this._canvasH / 2;

            this._context.fillRect(centerX - 100, centerY - 5, this._imageLoadingProgress * 2, 10);
            this._context.strokeRect(centerX - 100, centerY - 5, 200, 10);
        }

        if (this._drawImage && this._image !== undefined) {
            this.DrawBackground();
            this.DrawImage(this._image);
        }

        if (this._boxes.length > 0) {
            this.DrawBoxes();
        }

        if (this._selectedBox !== undefined) {
            this._selectedBox.DrawAdorners(this._context);
        }

        this._needRepaint = false;
        requestAnimationFrame(this.Render);
    }

    private DrawBoxes() {
        if (this._context !== null) {
            this._boxes.forEach((box) => {
                box.Draw(this._context);
            });
        }
    }

    // tslint:disable-next-line:variable-name
    private HandleResize = () => {
        if (this._canvas.parentElement !== null) {
            const w = this._canvas.parentElement.clientWidth; // window.innerWidth;
            const h = this._canvas.parentElement.clientHeight; // window.innerHeight;
            this._canvas.width = w;
            this._canvas.height = h;

            this._canvasW = this._canvas.width;
            this._canvasH = this._canvas.height;

            this._needRepaint = true;
        }
    }



    // tslint:disable-next-line:variable-name
    private DrawBackground = () => {
        // console.log(this._canvasW, this._canvasH);
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        const patterContext = patternCanvas.getContext('2d');
        if (patterContext !== null && this._context !== null) {
            patterContext.fillStyle = 'rgb(197, 197, 197)';
            patterContext.fillRect(0, 0, 10, 10);
            patterContext.fillRect(10, 10, 20, 20);

            const pattern = this._context.createPattern(patternCanvas, 'repeat');
            this._context.rect(0, 0, this._canvasW, this._canvasH);
            this._context.fillStyle = pattern;
            this._context.fill();
        }
    }

    private DrawImage(image: HTMLImageElement): void {

        // console.log(image.width, image.height);
        // console.log('N', image.naturalWidth, image.naturalHeight);
        this._originalImageW = image.width;
        this._originalImageH = image.height;
        const imageAspectRatio = image.width / image.height;
        const canvasAspectRatio = this._canvas.width / this._canvas.height;
        let renderableHeight: number = 0;
        let renderableWidth: number = 0;
        let xStart;
        let yStart;

        // If image's aspect ratio is less than canvas's we fit on height
        // and place the image centrally along width
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = this._canvas.height;
            renderableWidth = image.width * (renderableHeight / image.height);
            xStart = (this._canvas.width - renderableWidth) / 2;
            yStart = 0;
        } else if (imageAspectRatio > canvasAspectRatio) {
            // If image's aspect ratio is greater than canvas's we fit on width
            // and place the image centrally along height
            renderableWidth = this._canvas.width;
            renderableHeight = image.height * (renderableWidth / image.width);
            xStart = 0;
            yStart = (this._canvas.height - renderableHeight) / 2;
        } else {
            // Happy path - keep aspect ratio
            renderableHeight = this._canvas.height;
            renderableWidth = this._canvas.width;
            xStart = 0;
            yStart = 0;
        }

        this._imgX = xStart;
        this._imgY = yStart;
        this._imgW = renderableWidth;
        this._imgH = renderableHeight;
        if (this._context !== null) {

            this._context.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);
        }

        this.DrawDebugFrame();
    }

    private ClearContext(): void {
        if (this._context !== null) {
            this._context.clearRect(0, 0, this._canvasW, this._canvasH);
        }
    }

    private DrawDebugFrame(): void {
        if (this._options.debug !== true) { return; }
        if (this._context !== null) {
            this._context.strokeStyle = '#CC0000';
            this._context.lineWidth = 1;
            this._context.strokeRect(this._imgX, this._imgY, this._imgW, this._imgH);
        }

    }
}
