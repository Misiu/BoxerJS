"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var EventEmitter = (function () {
    function EventEmitter() {
    }
    EventEmitter.prototype.on = function (event, callback, ctx) {
        var e = this._e || (this._e = {});
        (e[event] || (e[event] = [])).push({
            fn: callback,
            ctx: ctx
        });
        return this;
    };
    EventEmitter.prototype.off = function (event, callback) {
        var e = this._e || (this._e = {});
        var evts = e[event];
        var liveEvents = [];
        if (evts && callback) {
            for (var i = 0, len = evts.length; i < len; i++) {
                if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
                    liveEvents.push(evts[i]);
                }
            }
        }
        (liveEvents.length)
            ? e[name] = liveEvents
            : delete e[name];
        return this;
    };
    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var data = [].slice.call(args, 1);
        var evtArr = ((this._e || (this._e = {}))[event] || []).slice();
        var i = 0;
        var len = evtArr.length;
        for (i; i < len; i++) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }
        return this;
    };
    return EventEmitter;
}());
var Box = (function () {
    function Box(x, y, w, h, fill, adorner) {
        if (adorner === void 0) { adorner = false; }
        this._adornerWidth = 6;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fill = fill;
        if (adorner) {
            return;
        }
        this._adorners = new Array();
        this._adorners.push(new Box(this.x - this._adornerWidth / 2, this.y - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w / 2 - this._adornerWidth / 2, this.y - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w - this._adornerWidth / 2, this.y - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w - this._adornerWidth / 2, this.y + h / 2 - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w - this._adornerWidth / 2, this.y + h - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x + w / 2 - this._adornerWidth / 2, this.y + h - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x - this._adornerWidth / 2, this.y + h - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
        this._adorners.push(new Box(this.x - this._adornerWidth / 2, this.y + h / 2 - this._adornerWidth / 2, this._adornerWidth, this._adornerWidth, '#CC0000', true));
    }
    Box.prototype.Contains = function (x, y) {
        return (this.x <= x) && (this.x + this.w >= x) && (this.y <= y) && (this.y + this.h >= y);
    };
    Box.prototype.GetResizeDirection = function (x, y) {
        if (this._adorners === undefined) {
            return -1;
        }
        for (var i = 0, len = this._adorners.length; i < len; i++) {
            if (this._adorners[i].Contains(x, y)) {
                return i;
            }
        }
        return -1;
    };
    Box.prototype.Draw = function (ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    Box.prototype.UpdateAdornersPosition = function () {
        if (this._adorners === undefined) {
            return;
        }
        this._adorners[0].x = this.x - this._adornerWidth / 2;
        this._adorners[0].y = this.y - this._adornerWidth / 2;
        this._adorners[1].x = this.x + this.w / 2 - this._adornerWidth / 2;
        this._adorners[1].y = this.y - this._adornerWidth / 2;
        this._adorners[2].x = this.x + this.w - this._adornerWidth / 2;
        this._adorners[2].y = this.y - this._adornerWidth / 2;
        this._adorners[3].x = this.x + this.w - this._adornerWidth / 2;
        this._adorners[3].y = this.y + this.h / 2 - this._adornerWidth / 2;
        this._adorners[4].x = this.x + this.w - this._adornerWidth / 2;
        this._adorners[4].y = this.y + this.h - this._adornerWidth / 2;
        this._adorners[5].x = this.x + this.w / 2 - this._adornerWidth / 2;
        this._adorners[5].y = this.y + this.h - this._adornerWidth / 2;
        this._adorners[6].x = this.x - this._adornerWidth / 2;
        this._adorners[6].y = this.y + this.h - this._adornerWidth / 2;
        this._adorners[7].x = this.x - this._adornerWidth / 2;
        this._adorners[7].y = this.y + this.h / 2 - this._adornerWidth / 2;
    };
    Box.prototype.DrawAdorners = function (ctx) {
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = '#CC0000';
        if (this._adorners === undefined) {
            return;
        }
        this.UpdateAdornersPosition();
        for (var _i = 0, _a = this._adorners; _i < _a.length; _i++) {
            var adorner = _a[_i];
            adorner.Draw(ctx);
        }
    };
    return Box;
}());
var Boxer = (function (_super) {
    __extends(Boxer, _super);
    function Boxer(canvas, options) {
        var _this = _super.call(this) || this;
        _this._canvasW = 0;
        _this._canvasH = 0;
        _this._originalImageW = 0;
        _this._originalImageH = 0;
        _this._imgX = 0;
        _this._imgY = 0;
        _this._imgW = 0;
        _this._imgH = 0;
        _this._needRepaint = false;
        _this._dragging = false;
        _this._dragoffx = 0;
        _this._dragoffy = 0;
        _this._resizing = false;
        _this._resizeoffx = 0;
        _this._resizeoffy = 0;
        _this._resizeDirection = -1;
        _this._boxes = new Array();
        _this._drawImage = false;
        _this._imageLoading = false;
        _this._imageLoadingProgress = 0;
        _this.Render = function () {
            if (_this._context === null) {
                return;
            }
            if (!_this._needRepaint) {
                requestAnimationFrame(_this.Render);
                return;
            }
            _this.ClearContext();
            if (_this._imageLoading && _this._context !== null) {
                _this._context.fillStyle = 'rgb(197, 197, 197)';
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
                _this._selectedBox.DrawAdorners(_this._context);
            }
            _this._needRepaint = false;
            requestAnimationFrame(_this.Render);
        };
        _this.HandleResize = function () {
            if (_this._canvas.parentElement !== null) {
                var w = _this._canvas.parentElement.clientWidth;
                var h = _this._canvas.parentElement.clientHeight;
                _this._canvas.width = w;
                _this._canvas.height = h;
                _this._canvasW = _this._canvas.width;
                _this._canvasH = _this._canvas.height;
                _this._needRepaint = true;
            }
        };
        _this.DrawBackground = function () {
            var patternCanvas = document.createElement('canvas');
            patternCanvas.width = 20;
            patternCanvas.height = 20;
            var patterContext = patternCanvas.getContext('2d');
            if (patterContext !== null && _this._context !== null) {
                patterContext.fillStyle = 'rgb(197, 197, 197)';
                patterContext.fillRect(0, 0, 10, 10);
                patterContext.fillRect(10, 10, 20, 20);
                var pattern = _this._context.createPattern(patternCanvas, 'repeat');
                _this._context.rect(0, 0, _this._canvasW, _this._canvasH);
                _this._context.fillStyle = pattern;
                _this._context.fill();
            }
        };
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('You must pass Canvas as first argument!');
        }
        _this._canvas = canvas;
        var ctx = _this._canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('Unable to get context from Canvas.');
        }
        _this._context = ctx;
        _this._canvasW = _this._canvas.width;
        _this._canvasH = _this._canvas.height;
        _this._options = {
            debug: false,
            readonly: false,
            responsive: false
        };
        _this._options = __assign({}, _this._options, options);
        _this.SetupCanvasAttributes();
        _this.AttachEventHandlers();
        _this.Render();
        return _this;
    }
    Boxer.prototype.LoadImage = function (url) {
        var _this = this;
        this._image = new Image();
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET', url, true);
        xmlHttpRequest.responseType = 'arraybuffer';
        xmlHttpRequest.onload = function () {
            var h = xmlHttpRequest.getAllResponseHeaders();
            var m = h.match(/^Content-Type\:\s*(.*?)$/mi);
            if (m !== null) {
                var mimeType = m[1] || 'image/png';
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
                _this._imageLoadingProgress = completedPercentage;
                _this._needRepaint = true;
            }
        };
        xmlHttpRequest.onloadstart = function () {
            _this._needRepaint = true;
        };
        xmlHttpRequest.onloadend = function () {
            _this._imageLoading = false;
            _this._needRepaint = true;
            _this.emit('imageLoaded');
        };
        xmlHttpRequest.onerror = function (e) {
        };
        xmlHttpRequest.send();
        this._imageLoading = true;
        this._imageLoadingProgress = 0;
    };
    Boxer.prototype.LoadBoxes = function (boxes) {
        for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
            var box = boxes_1[_i];
            this.AddBox(new Box(box.x, box.y, box.w, box.h, 'rgba(0,255,0,.6)'));
        }
    };
    Boxer.prototype.GetBoxes = function () {
        return this._boxes;
    };
    Boxer.prototype.SetupCanvasAttributes = function () {
        if (!this._canvas.hasAttribute('tabindex')) {
            this._canvas.setAttribute('tabindex', '1');
        }
    };
    Boxer.prototype.AttachEventHandlers = function () {
        var _this = this;
        this._canvas.addEventListener('mousedown', function (event) {
            var pos = _this.GetMousePosition(event);
            for (var _i = 0, _a = _this._boxes; _i < _a.length; _i++) {
                var box = _a[_i];
                _this._resizeDirection = box.GetResizeDirection(pos.x, pos.y);
                if (_this._resizeDirection !== -1) {
                    _this._selectedBox = box;
                    _this._resizeoffx = pos.x - _this._selectedBox.x;
                    _this._resizeoffy = pos.y - _this._selectedBox.y;
                    _this._resizing = true;
                    return;
                }
                if (box.Contains(pos.x, pos.y)) {
                    _this._selectedBox = box;
                    _this._dragoffx = pos.x - _this._selectedBox.x;
                    _this._dragoffy = pos.y - _this._selectedBox.y;
                    _this._dragging = true;
                    _this._needRepaint = true;
                    return;
                }
            }
            if (_this._selectedBox !== undefined) {
                _this._selectedBox = undefined;
                _this._needRepaint = true;
            }
        }, true);
        this._canvas.addEventListener('mousemove', function (event) {
            if (_this._dragging && _this._selectedBox !== undefined) {
                var position = _this.GetMousePosition(event);
                _this._selectedBox.x = position.x - _this._dragoffx;
                _this._selectedBox.y = position.y - _this._dragoffy;
                _this._needRepaint = true;
                return;
            }
            var pos = _this.GetMousePosition(event);
            if (_this._resizeDirection === -1) {
                for (var _i = 0, _a = _this._boxes; _i < _a.length; _i++) {
                    var box = _a[_i];
                    var rd = box.GetResizeDirection(pos.x, pos.y);
                    switch (rd) {
                        case 0:
                            _this._canvas.style.cursor = 'nw-resize';
                            break;
                        case 1:
                            _this._canvas.style.cursor = 'n-resize';
                            break;
                        case 2:
                            _this._canvas.style.cursor = 'ne-resize';
                            break;
                        case 3:
                            _this._canvas.style.cursor = 'w-resize';
                            break;
                        case 4:
                            _this._canvas.style.cursor = 'se-resize';
                            break;
                        case 5:
                            _this._canvas.style.cursor = 's-resize';
                            break;
                        case 6:
                            _this._canvas.style.cursor = 'sw-resize';
                            break;
                        case 7:
                            _this._canvas.style.cursor = 'e-resize';
                            break;
                        default:
                            _this._canvas.style.cursor = 'auto';
                            break;
                    }
                    if (rd !== -1) {
                        break;
                    }
                }
            }
            if (_this._resizing && _this._selectedBox !== undefined) {
                var oldx = _this._selectedBox.x;
                var oldy = _this._selectedBox.y;
                switch (_this._resizeDirection) {
                    case 0:
                        _this._selectedBox.x = pos.x;
                        _this._selectedBox.y = pos.y;
                        _this._selectedBox.w += oldx - pos.x;
                        _this._selectedBox.h += oldy - pos.y;
                        _this._needRepaint = true;
                        break;
                    case 1:
                        _this._selectedBox.y = pos.y;
                        _this._selectedBox.h += oldy - pos.y;
                        _this._needRepaint = true;
                        break;
                    case 2:
                        _this._selectedBox.y = pos.y;
                        _this._selectedBox.w = pos.x - oldx;
                        _this._selectedBox.h += oldy - pos.y;
                        _this._needRepaint = true;
                        break;
                    case 3:
                        _this._selectedBox.w = pos.x - oldx;
                        _this._needRepaint = true;
                        break;
                    case 4:
                        _this._selectedBox.w = pos.x - oldx;
                        _this._selectedBox.h = pos.y - oldy;
                        _this._needRepaint = true;
                        break;
                    case 5:
                        _this._selectedBox.h = pos.y - oldy;
                        _this._needRepaint = true;
                        break;
                    case 6:
                        _this._selectedBox.x = pos.x;
                        _this._selectedBox.w += oldx - pos.x;
                        _this._selectedBox.h = pos.y - oldy;
                        _this._needRepaint = true;
                        break;
                    case 7:
                        _this._selectedBox.x = pos.x;
                        _this._selectedBox.w += oldx - pos.x;
                        _this._needRepaint = true;
                        break;
                    default:
                        _this._canvas.style.cursor = 'auto';
                        break;
                }
            }
        }, true);
        this._canvas.addEventListener('mouseup', function (event) {
            _this._dragging = false;
            _this._resizing = false;
            _this._resizeDirection = -1;
        }, true);
        this._canvas.addEventListener('mouseleave', function (event) {
            _this._dragging = false;
            _this._resizing = false;
            _this._needRepaint = true;
        }, true);
        this._canvas.addEventListener('mousewheel', function (event) {
            event.preventDefault();
            return false;
        }, true);
        this._canvas.addEventListener('keydown', function (event) {
            if (event.keyCode === 46 && _this._selectedBox !== undefined && !_this._dragging) {
                _this.RemoveSelectedBox();
            }
        }, true);
        this._canvas.addEventListener('dblclick', function (event) {
            var pos = _this.GetMousePosition(event);
            _this.AddBox(new Box(pos.x - 10, pos.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
        }, true);
        this._canvas.addEventListener('selectstart', function (event) {
            return false;
        }, true);
        this._canvas.onselectstart = function () {
            return false;
        };
        if (this._options.responsive) {
            window.addEventListener('resize', this.HandleResize);
            this.HandleResize();
        }
    };
    Boxer.prototype.GetMousePosition = function (event) {
        var rect = this._canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };
    Boxer.prototype.AddBox = function (box) {
        this._boxes.push(box);
        this._needRepaint = true;
    };
    Boxer.prototype.RemoveSelectedBox = function () {
        if (this._selectedBox === undefined) {
            return;
        }
        var index = this._boxes.indexOf(this._selectedBox);
        if (index > -1) {
            this._boxes.splice(index, 1);
        }
        this._selectedBox = undefined;
        this._needRepaint = true;
    };
    Boxer.prototype.DrawBoxes = function () {
        var _this = this;
        if (this._context !== null) {
            this._boxes.forEach(function (box) {
                box.Draw(_this._context);
            });
        }
    };
    Boxer.prototype.DrawImage = function (image) {
        this._originalImageW = image.width;
        this._originalImageH = image.height;
        var imageAspectRatio = image.width / image.height;
        var canvasAspectRatio = this._canvas.width / this._canvas.height;
        var renderableHeight = 0;
        var renderableWidth = 0;
        var xStart;
        var yStart;
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = this._canvas.height;
            renderableWidth = image.width * (renderableHeight / image.height);
            xStart = (this._canvas.width - renderableWidth) / 2;
            yStart = 0;
        }
        else if (imageAspectRatio > canvasAspectRatio) {
            renderableWidth = this._canvas.width;
            renderableHeight = image.height * (renderableWidth / image.width);
            xStart = 0;
            yStart = (this._canvas.height - renderableHeight) / 2;
        }
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
    return Boxer;
}(EventEmitter));
