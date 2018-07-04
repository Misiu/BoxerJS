"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Box = /** @class */ (function () {
    function Box(x, y, w, h, fill) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this._fill = fill;
    }
    Box.prototype.Paint = function (ctx) {
        if (ctx === null)
            return;
        ctx.fillStyle = this._fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    return Box;
}());
var Boxer = /** @class */ (function () {
    function Boxer(canvas, options) {
        var _this = this;
        this._canvasW = 0;
        this._canvasH = 0;
        this._originalImageW = 0;
        this._originalImageH = 0;
        this._imgX = 0;
        this._imgY = 0;
        this._imgW = 0;
        this._imgH = 0;
        this._needRepaint = false;
        this._dragging = false;
        this._dragoffx = 0;
        this._dragoffy = 0;
        this.Render = function () {
            if (_this._context === null)
                return;
            if (!_this._needRepaint) {
                requestAnimationFrame(_this.Render);
                return;
            }
            _this.ClearContext();
            if (_this._imageLoading && _this._context !== null) {
                _this._context.fillStyle = "rgb(197, 197, 197)";
                _this._context.strokeStyle = 'rgb(197, 197, 197)';
                _this._context.lineWidth = 1;
                var centerX = _this._canvasW / 2;
                var centerY = _this._canvasH / 2;
                _this._context.fillRect(centerX - 100, centerY - 5, _this._imageLoadingProgress * 2, 10);
                _this._context.strokeRect(centerX - 100, centerY - 5, 200, 10);
            }
            if (_this._drawImage && _this._image !== undefined) {
                _this.DrawBackground();
                _this.DrawImage(_this._image);
            }
            if (_this._boxes.length > 0) {
                _this.DrawBoxes();
            }
            if (_this._selectedBox !== undefined) {
                _this._context.strokeStyle = '#CC0000';
                _this._context.lineWidth = 2;
                _this._context.strokeRect(_this._selectedBox.x, _this._selectedBox.y, _this._selectedBox.w, _this._selectedBox.h);
            }
            _this._needRepaint = false;
            requestAnimationFrame(_this.Render);
        };
        this.HandleResize = function () {
            if (_this._canvas.parentElement !== null) {
                var w = _this._canvas.parentElement.clientWidth; //window.innerWidth;
                var h = _this._canvas.parentElement.clientHeight; //window.innerHeight;
                _this._canvas.width = w;
                _this._canvas.height = h;
                _this._canvasW = _this._canvas.width;
                _this._canvasH = _this._canvas.height;
                _this._needRepaint = true;
            }
        };
        this.DrawBackground = function () {
            //console.log(this._canvasW, this._canvasH);
            var patternCanvas = document.createElement('canvas');
            patternCanvas.width = 20;
            patternCanvas.height = 20;
            var patterContext = patternCanvas.getContext('2d');
            if (patterContext !== null && _this._context !== null) {
                patterContext.fillStyle = "rgb(197, 197, 197)";
                patterContext.fillRect(0, 0, 10, 10);
                patterContext.fillRect(10, 10, 20, 20);
                var pattern = _this._context.createPattern(patternCanvas, "repeat");
                _this._context.rect(0, 0, _this._canvasW, _this._canvasH);
                _this._context.fillStyle = pattern;
                _this._context.fill();
            }
        };
        this._drawImage = false;
        this._imageLoading = false;
        this._imageLoadingProgress = 0;
        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error('You must pass Canvas as first argument!');
        this._canvas = canvas;
        var ctx = this._canvas.getContext('2d');
        if (ctx === null)
            throw new Error('Unable to get context from Canvas.');
        this._context = ctx;
        this._canvasW = this._canvas.width;
        this._canvasH = this._canvas.height;
        this._options = {
            responsive: false,
            debug: false,
            readonly: false
        };
        this._options = __assign({}, this._options, options);
        this.SetupCanvasAttributes();
        this.AttachEventHandlers();
        this.Render();
    }
    Boxer.prototype.SetupCanvasAttributes = function () {
        if (!this._canvas.hasAttribute('tabindex')) {
            this._canvas.setAttribute('tabindex', '1');
        }
        //this._needRepaint = true;
    };
    Boxer.prototype.AttachEventHandlers = function () {
        var _this = this;
        this._canvas.addEventListener('mousedown', function (event) {
            var pos = _this.GetMousePosition(event);
            for (var _i = 0, _a = _this._boxes; _i < _a.length; _i++) {
                var box = _a[_i];
                if (box.Contains(pos.x, pos.y)) {
                    _this._selectedBox = box;
                    _this._dragoffx = pos.x - _this._selectedBox.x;
                    _this._dragoffy = pos.y - _this._selectedBox.y;
                    _this._dragging = true;
                    _this._needRepaint = true;
                    return;
                }
            }
            _this._canvas.addEventListener('dblclick', function (event) {
                //console.log('dblclick', event);
                var pos = _this.getMousePos(event);
                _this.AddBox(new Box(pos.x - 10, pos.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
            }, true);
            _this._canvas.addEventListener('mousemove', function (event) {
                if (_this._dragging && _this._selectedBox !== undefined) {
                    var position = _this.GetMousePosition(event);
                    // We don't want to drag the object by its top-left corner, we want to drag it
                    // from where we clicked. Thats why we saved the offset and use it here
                    _this._selectedBox.x = position.x - _this._dragoffx;
                    _this._selectedBox.y = position.y - _this._dragoffy;
                    _this._needRepaint = true;
                }
            }, true);
            _this._canvas.addEventListener('mouseup', function (event) {
                _this._dragging = false;
            }, true);
            _this._canvas.addEventListener('mouseleave', function (event) {
                _this._dragging = false;
                //this._selectedBox=undefined;
                _this._needRepaint = true;
            }, true);
            _this._canvas.addEventListener('mousewheel', function (event) {
                //console.log(event);
                event.preventDefault();
                return false;
            }, true);
            _this._canvas.addEventListener('dblclick', function (event) {
                var pos = _this.GetMousePosition(event);
                _this.AddBox(new Box(pos.x - 10, pos.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
            }, true);
            _this._canvas.addEventListener('selectstart', function (event) {
                //event.preventDefault();
                return false;
            }, false);
            if (_this._options.responsive) {
                window.addEventListener("resize", _this.HandleResize);
                _this.HandleResize();
            }
        }, getMousePos(event, MouseEvent), Point, {
            var: rect = this._canvas.getBoundingClientRect(),
            return: {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
        }, private, _boxes, Array < Box > , new Array());
    };
    Boxer.prototype.AddBox = function (box) {
        this._boxes.push(box);
        this._needRepaint = true;
    };
    Boxer.prototype.DrawBoxes = function () {
        var _this = this;
        if (this._context !== null) {
            this._boxes.forEach(function (box) {
                box.Paint(_this._context);
            });
        }
    };
    Boxer.prototype.DrawImage = function (image) {
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
            renderableWidth = this._canvas.width;
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
    };
    Boxer.prototype.ClearContext = function () {
        if (this._context !== null) {
            this._context.clearRect(0, 0, this._canvasW, this._canvasH);
        }
    };
    Boxer.prototype.DrawDebugFrame = function () {
        if (this._options.debug !== true) {
            return;
        }
        if (this._context !== null) {
            this._context.strokeStyle = '#CC0000';
            this._context.lineWidth = 1;
            this._context.strokeRect(this._imgX, this._imgY, this._imgW, this._imgH);
        }
    };
    Boxer.prototype.LoadImage = function (url) {
        var _this = this;
        this._image = new Image();
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET', url, true);
        xmlHttpRequest.responseType = 'arraybuffer';
        xmlHttpRequest.onload = function () {
            var h = xmlHttpRequest.getAllResponseHeaders(), m = h.match(/^Content-Type\:\s*(.*?)$/mi);
            if (m !== null) {
                var mimeType = m[1] || 'image/png';
                // Remove your progress bar or whatever here. Load is done.
                var blob = new Blob([xmlHttpRequest.response], { type: mimeType });
                if (_this._image !== undefined) {
                    _this._image.src = window.URL.createObjectURL(blob);
                    setTimeout(function () {
                        _this._drawImage = true;
                        _this._imageLoading = false;
                        _this._needRepaint = true;
                    }, 5);
                }
            }
        };
        xmlHttpRequest.onprogress = function (e) {
            if (e.lengthComputable) {
                var completedPercentage = (e.loaded / e.total) * 100;
                console.log(completedPercentage + ' %');
                _this._imageLoadingProgress = completedPercentage;
                _this._needRepaint = true;
            }
        };
        xmlHttpRequest.onloadstart = function () {
            console.log(0 + ' %');
            _this._needRepaint = true;
        };
        xmlHttpRequest.onloadend = function () {
            console.log('sto');
            _this._imageLoading = false;
            _this._needRepaint = true;
        };
        xmlHttpRequest.onerror = function (e) {
            console.log(e);
        };
        xmlHttpRequest.send();
        //this._imageLoading = true;
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
    };
    return Boxer;
}());
