"use strict";
var Boxer = /** @class */ (function () {
    function Boxer(canvas, options) {
        this._canvasW = 0;
        this._canvasH = 0;
        this._canvas = canvas;
        this._canvasW = this._canvas.width;
        this._canvasH = this._canvas.height;
        this._context = this._canvas.getContext('2d');
        console.log(this._canvasW, this._canvasH);
        this.Init();
    }
    Boxer.prototype.Init = function () {
        if (!this._canvas.hasAttribute('tabindex')) {
            this._canvas.setAttribute('tabindex', '1');
        }
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
    };
    Boxer.prototype.LoadImage = function (url) {
        throw new Error("Method not implemented.");
    };
    return Boxer;
}());
