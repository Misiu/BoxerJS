interface iBoxerOptions {
    responsive: boolean,
    debug: boolean,
    readonly: boolean
}

interface IBoxer {
    LoadImage(url: string): void;
}

class Box {
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;

    private _fill: string;
    constructor(x: number, y: number, w: number, h: number, fill: string) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        this._fill = fill;
    }

    Paint(ctx: CanvasRenderingContext2D | null): void {
        if(ctx===null) return;

        ctx.fillStyle = this._fill;
        ctx.fillRect(this._x, this._y, this._w, this._h);
    }
}

class Boxer implements IBoxer {
    //canvas
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null;

    private _canvasW: number = 0;
    private _canvasH: number = 0;

    //options
    private _options: iBoxerOptions;

    private _originalImageW: number = 0;
    private _originalImageH: number = 0;

    private _imgX: number = 0;
    private _imgY: number = 0;
    private _imgW: number = 0;
    private _imgH: number = 0;

    private _needRepaint: boolean = false;

    constructor(canvas: HTMLCanvasElement, options?: iBoxerOptions) {

        this._canvas = canvas;
        this._canvasW = this._canvas.width;
        this._canvasH = this._canvas.height;

        this._context = this._canvas.getContext('2d');

        this._options = {
            responsive: false,
            debug: false,
            readonly: false
        };
        this._options = { ...this._options, ...options };

        this.SetupCanvasAttributes();
        this.AttachEventHandlers();

        if (this._options.responsive) {
            window.addEventListener("resize", this.HandleResize);
            this.HandleResize();
        }

        this.Render();
    }

    private SetupCanvasAttributes(): void {
        if (!this._canvas.hasAttribute('tabindex')) {
            this._canvas.setAttribute('tabindex', '1');
        }
        this._needRepaint = true;
    }

    AttachEventHandlers(): any {
        this._canvas.addEventListener('mousedown', (event) => {
            //console.log('mousedown', event);
        }, true);

        this._canvas.addEventListener('dblclick', (event) => {
            //console.log('dblclick', event);
var pos = this.getMousePos(event);
            this.AddBox(new Box(pos.x-10, pos.y-10, 20, 20, 'rgba(0,255,0,.6)'));
        }, true);

        this._canvas.addEventListener('mousemove', (event) => {
            //console.log('mousemove', event);
        }, true);

        this._canvas.addEventListener('mouseup', (event) => {
            //console.log('mouseup', event);
        }, true);

        this._canvas.addEventListener('mouseleave', (event) => {
            //console.log('mouseleave', event);
        }, true);

        this._canvas.addEventListener('mousewheel', (event) => {
            //console.log(event);
            event.preventDefault();
            return false;
        }, true);

        this._canvas.addEventListener('selectstart', (event) => {
            //event.preventDefault();
            return false;
        }, false);
    }

    getMousePos(evt:MouseEvent):any {
        var rect = this._canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    private _boxes: Array<Box> = new Array<Box>();

    public AddBox(box: Box) {
        this._boxes.push(box);
        this._needRepaint = true;
    }

    /*     public getMouse(e:MouseEvent) {
            var element = this._canvas, offsetX = 0, offsetY = 0, mx, my;
            
            // Compute the total offset
            if (element.offsetParent !== undefined) {
              do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
              } while ((element = element.offsetParent));
            }
          
            // Add padding and border style widths to offset
            // Also add the <html> offsets in case there's a position:fixed bar
            offsetX += this._canvas.stylePaddingLeft + _can.styleBorderLeft + this.htmlLeft;
            offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
          
            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;
            
            // We return a simple javascript object (a hash) with x and y defined
            return {x: mx, y: my};
          } */

    public Render = () => {

        if (this._needRepaint) {
            //console.log('repaint');
            this.ClearContext();


            if (this._imageLoading && this._context !== null) {
                this._context.fillStyle = "rgb(197, 197, 197)";
                this._context.strokeStyle = 'rgb(197, 197, 197)';
                this._context.lineWidth = 1;

                var centerX: number = this._canvasW / 2;
                var centerY: number = this._canvasH / 2;

                this._context.fillRect(centerX - 100, centerY - 5, this._imageLoadingProgress * 2, 10);
                this._context.strokeRect(centerX - 100, centerY - 5, 200, 10);
            }

            if (this._drawImage && this._image !== undefined) {
                this.DrawBackground();
                this.DrawImage(this._image);
            }

            //console.log(this._boxes);
            if (this._boxes.length > 0) {
                this.DrawBoxes();
            }

            this._needRepaint = false;
        }
        requestAnimationFrame(this.Render);
    }

    public DrawBoxes() {
        if (this._context !== null) {
            this._boxes.forEach(box => {
                box.Paint(this._context);
            });
        }
    }

    public HandleResize = () => {
        if (this._canvas.parentElement !== null) {
            var w = this._canvas.parentElement.clientWidth;//window.innerWidth;
            var h = this._canvas.parentElement.clientHeight;//window.innerHeight;
            this._canvas.width = w;
            this._canvas.height = h;

            this._canvasW = this._canvas.width;
            this._canvasH = this._canvas.height;

            this._needRepaint = true;
        }
    }



    private DrawBackground = () => {
        //console.log(this._canvasW, this._canvasH);
        var patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        var patterContext = patternCanvas.getContext('2d');
        if (patterContext !== null && this._context !== null) {
            patterContext.fillStyle = "rgb(197, 197, 197)";
            patterContext.fillRect(0, 0, 10, 10);
            patterContext.fillRect(10, 10, 20, 20);

            var pattern = this._context.createPattern(patternCanvas, "repeat");
            this._context.rect(0, 0, this._canvasW, this._canvasH);
            this._context.fillStyle = pattern;
            this._context.fill();
        }
    }

    private DrawImage(image: HTMLImageElement): void {

        //console.log(image.width, image.height);
        //console.log('N', image.naturalWidth, image.naturalHeight);
        this._originalImageW = image.width;
        this._originalImageH = image.height;
        var imageAspectRatio = image.width / image.height;
        var canvasAspectRatio = this._canvas.width / this._canvas.height;
        var renderableHeight, renderableWidth, xStart, yStart;

        // If image's aspect ratio is less than canvas's we fit on height
        // and place the image centrally along width
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = this._canvas.height;
            renderableWidth = image.width * (renderableHeight / image.height);
            xStart = (this._canvas.width - renderableWidth) / 2;
            yStart = 0;
        }

        // If image's aspect ratio is greater than canvas's we fit on width
        // and place the image centrally along height
        else if (imageAspectRatio > canvasAspectRatio) {
            renderableWidth = this._canvas.width
            renderableHeight = image.height * (renderableWidth / image.width);
            xStart = 0;
            yStart = (this._canvas.height - renderableHeight) / 2;
        }

        // Happy path - keep aspect ratio
        else {
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

    private _image: HTMLImageElement | undefined;
    private _drawImage: boolean = false;
    private _imageLoading: boolean = false;
    private _imageLoadingProgress: number = 0;

    LoadImage(url: string): void {

        this._image = new Image();


        var xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET', url, true);
        xmlHttpRequest.responseType = 'arraybuffer';

        xmlHttpRequest.onload = () => {
            var h = xmlHttpRequest.getAllResponseHeaders(),
                m = h.match(/^Content-Type\:\s*(.*?)$/mi);
            if (m !== null) {
                var mimeType = m[1] || 'image/png';
                // Remove your progress bar or whatever here. Load is done.

                var blob = new Blob([xmlHttpRequest.response], { type: mimeType });

                if (this._image !== undefined) {
                    this._image.src = window.URL.createObjectURL(blob);
                    setInterval(() => {
                        this._drawImage = true;
                        this._imageLoading = false;
                        this._needRepaint = true;
                    }, 5)
                }
            }
        }

        xmlHttpRequest.onprogress = (e) => {
            if (e.lengthComputable) {
                var completedPercentage = (e.loaded / e.total) * 100;
                console.log(completedPercentage + ' %');
                this._imageLoadingProgress = completedPercentage;
                this._needRepaint = true;
            }
        };

        xmlHttpRequest.onloadstart = () => {
            console.log(0 + ' %');
            this._needRepaint = true;
        };

        xmlHttpRequest.onloadend = () => {
            console.log('sto');
            this._imageLoading = false;
            this._needRepaint = true;
        }

        xmlHttpRequest.onerror = (e) => {
            console.log(e);
        }

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
}