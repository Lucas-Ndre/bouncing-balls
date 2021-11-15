const gameName = document.querySelector('h1');
const countDiv = document.getElementById('count');
const ballCountText = document.getElementById('total-count');
const p1count = document.createElement('p');
const p2count = document.createElement('p');

const removableContent = document.querySelector('.init');
const playerChoice = document.querySelectorAll('input[name="playernb"]');
const playBtn = document.getElementById('playbtn');

// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function Shape(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = true;
}

Shape.prototype.update = function () {
    if (this.x + this.size >= width) {
        this.velX = - (this.velX)
    }
    if (this.y + this.size >= height) {
        this.velY = - (this.velY)
    }
    if (this.x - this.size <= 0) {
        this.velX = - (this.velX)
    }
    if (this.y - this.size <= 0) {
        this.velY = - (this.velY)
    }

    this.x += this.velX;
    this.y += this.velY;
}



class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY);
        this.color = color;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    collisionDetect() {
        for (let i = 0; i < balls.length; i++) {
            if (!(this === balls[i])) {
                const dx = this.x - balls[i].x;
                const dy = this.y - balls[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < (this.size + balls[i].size) && balls[i].exists) {
                    this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                }
            }
        }
        for (let j = 0; j < circles.length; j++) {
            const dx = this.x - circles[j].x;
            const dy = this.y - circles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < (this.size + circles[j].size)) {
                this.exists = false;
                if (circles.length === 2) {
                    if (j === 0) {
                        redScore++;
                    }
                    else if (j === 1) {
                        blueScore++;
                    }
                    else { console.log('error : circles length in collisionDetect') }
                }
            }
        }
    }
}



class EvilCircle extends Shape {
    constructor(x, y, velX, velY, color, number, size) {
        super(x, y, velX, velY);
        this.color = color;
        this.size = size;
        this.number = number;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }
    update() {
        let c0 = circles[0];
        if (circles[1]) { let c1 = circles[1]; };

        window.onkeydown = function (evt) {
            keysPressed[evt.key] = true;

            if (keysPressed['z'] && c0.y - c0.size > 0) {
                c0.y -= c0.velY;
            }
            if (keysPressed['s'] && c0.y + c0.size < height) {
                c0.y += c0.velY;
            }
            if (keysPressed['d'] && c0.x + c0.size < width) {
                c0.x += c0.velX;
            }
            if (keysPressed['q'] && c0.x - c0.size > 0) {
                c0.x -= c0.velX;
            }
            if (circles[1]) {
                let c1 = circles[1];
                if (keysPressed['ArrowUp'] && c1.y - c1.size > 0) {
                    c1.y -= c1.velY;
                }
                if (keysPressed['ArrowDown'] && c1.y + c1.size < height) {
                    c1.y += c1.velY;
                }
                if (keysPressed['ArrowRight'] && c1.x + c1.size < width) {
                    c1.x += c1.velX;
                }
                if (keysPressed['ArrowLeft'] && c1.x - c1.size > 0) {
                    c1.x -= c1.velX;
                }
            }
        };
        window.onkeyup = function (evt) {
            delete keysPressed[evt.key];
        };
    }
}


function updateBallCount() {
    ballCountText.textContent = 'Ball count : ';
    let ballCount = 0;
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists === true) {
            ballCount++;
        }
    }
    ballCountText.textContent += ballCount;
    if (circles.length === 2) {
        p1count.textContent = 'Red Score : ' + redScore;
        p2count.textContent = 'Blue Score : ' + blueScore;
    }
}


function initialize() {
    document.body.style.background = 'rgb(28, 40, 51)';
    for (const nbplayer of playerChoice) {
        if (nbplayer.checked) {
            playerNumber = parseInt(nbplayer.value);
        }
    }
    playBtn.addEventListener('click', launchGame);
}


function launchGame() {
    document.body.removeChild(removableContent);
    gameName.textContent = 'bouncing balls';
    if (circles.length === 2) {
        p1count.style.color = 'rgb(255, 100, 100)';
        p2count.style.color = 'rgb(100, 100, 255)';
        countDiv.appendChild(p1count);
        countDiv.appendChild(p2count);
    }
    loop();
}


function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists === true) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    for (let j = 0; j < circles.length; j++) {
        circles[j].draw();
        circles[j].update();
    }
    updateBallCount();
    requestAnimationFrame(loop);
}


initialize();

let keysPressed = {};
let balls = [];
while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        random(size, width - size),
        random(size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
};

let circles = [];
for (let i = 0; i < playerNumber; i++) {
    if (i === 0) {
        color = 'red';
    }
    else if (i === 1) {
        color = 'blue';
    }
    else { console.log('numberplayer incorrect in circles definition') }
    let size = 10;
    let vel = 12;
    let circle = new EvilCircle(
        random(size, width - size),
        random(size, height - size),
        vel,
        vel,
        color,
        i,
        size
    );
    circles.push(circle);
};

if (playerNumber === 2) {
    var redScore = 0;
    var blueScore = 0;
}