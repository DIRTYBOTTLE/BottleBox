const imgUrls = [
    './img/桃花瓣.png',
    './img/星星.png'
]
const img = new Image();
img.src = imgUrls[Math.floor(Math.random() * imgUrls.length)]

class Rain {
    constructor(x, y, s, r, fn) {
        [this.x, this.y, this.s, this.r, this.fn] = [...arguments];
    }

    draw(cxt) {
        cxt.save();
        cxt.translate(this.x, this.y);
        cxt.rotate(this.r);
        cxt.drawImage(img, 0, 0, 25 * this.s, 25 * this.s);
        cxt.restore();
    }

    update() {
        this.x = this.fn.x(this.x);
        this.y = this.fn.y(this.y);
        this.r = this.fn.r(this.r);
        if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
            this.s = getRandom('s');
            this.r = getRandom('r');
            this.fn.r = getRandom('fnr');
            if (Math.random() > 0.4) {
                this.x = getRandom('x');
                this.y = 0;
            } else {
                this.x = window.innerWidth;
                this.y = getRandom('y');
            }
        }
    }
}

class RainList {
    constructor() {
        this.list = [];
    }

    push(rain) {
        this.list.push(rain);
    }

    update() {
        const len = this.list.length;
        for (let i = 0; i < len; i++) {
            this.list[i].update();
        }
    }

    draw(cxt) {
        const len = this.list.length;
        for (let i = 0; i < len; i++) {
            this.list[i].draw(cxt);
        }
    }
}

function getRandom(option) {
    let ret, random;
    switch (option) {
        case 'x':
            ret = Math.random() * window.innerWidth;
            break;
        case 'y':
            ret = Math.random() * window.innerHeight;
            break;
        case 's':
            ret = Math.random();
            break;
        case 'r':
            ret = Math.random() * 6;
            break;
        case 'fnx':
            random = -0.5 + Math.random();
            ret = function (x) {
                return x + 0.5 * random - 1.7;
            }
            break;
        case 'fny':
            random = 1.5 + Math.random() * 0.7;
            ret = function (y) {
                return y + random;
            }
            break;
        case 'fnr':
            random = Math.random() * 0.03;
            ret = function (r) {
                return r + random;
            }
            break;
    }
    return ret;
}

function startRain() {
    const canvas = document.createElement('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.setAttribute('style', 'position: fixed;left : 0;top: 0;pointer-events: none');
    canvas.setAttribute('id', 'canvas_rain');
    document.body.appendChild(canvas);
    const cxt = canvas.getContext('2d');
    const rainList = new RainList();
    for (let i = 0; i < 50; i++) {
        const rain = new Rain(getRandom('x'), getRandom('y'), getRandom('s'), getRandom('r'),
            { x: getRandom('fnx'), y: getRandom('fny'), r: getRandom('fnr') });
        rain.draw(cxt);
        rainList.push(rain);
    }
    const requestAnimationFrame = window.requestAnimationFrame;
    let stop = requestAnimationFrame(function reverse() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        rainList.update();
        rainList.draw(cxt);
        stop = requestAnimationFrame(reverse);
    })
}

window.onresize = function () {
    const canvas = document.getElementById('canvas_rain');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function closureRain() {
    let raining = false;
    return function () {
        if (raining) {
            const child = document.getElementById('canvas_rain');
            child.parentNode.removeChild(child);
            window.cancelAnimationFrame(stop);
            raining = false;
        } else {
            startRain();
            raining = true;
        }
    };
}

export default closureRain();