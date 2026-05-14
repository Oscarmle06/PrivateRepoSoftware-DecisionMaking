/*
this.ba * Detection of collisions between boxes
 *
 * Gilberto Echeverria
 * 2025-03-13
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let ballSpeed = 3;
let paddleSpeed = 5;
let speedIncrease = 1.15;

class Border extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color);

    }
}

// Class for the main character in the game
class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(1, 1);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(ballSpeed).times(deltaTime));
        this.updateCollider();
    }

    reset() {
        this.position.x = canvasWidth / 2;
        this.position.y = canvasHeight / 2;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    serve() {
        let angle = Math.random() * Math.PI / 2 - Math.PI / 4;
        this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
        ballSpeed = 3;

        // Select a random direction
        if (Math.random() > 0.5) {
            this.velocity.x *= -1;
        }
    }
}

class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            down: {
                axis: "y",
                sign: 1,
            }
        }
        // Keys pressed to move the player
        this.keys = [];
        let halfSize = height / 2
    }


    update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // TODO: Normalize the velocity to avoid greater speed on diagonals
        this.velocity = this.velocity.normalize().times(paddleSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
        this.updateCollider();
    }


    clampWithinCanvas() {
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y + 40;
        }
        if (this.position.y + this.halfSize.y > canvasHeight){
            this.position.y = canvasHeight - this.halfSize.y - 40;
        }
    }
}


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects()

        this.scoreleft = 0;
        this.scoreright = 0;

        this.scoreLabelLeft = new TextLabel(canvasWidth/4, 100, "40px Arial", "red")
        this.scoreLabelRight = new TextLabel(3*canvasWidth/4, 100, "40px Arial", "blue")

    }

    initObjects() {
        this.paddleLeft = new Paddle(new Vector(50, canvasHeight / 2), 40, 100, "red");
        this.paddleRight = new Paddle(new Vector(canvasWidth - 50, canvasHeight / 2), 40, 100, "blue");
        this.BorderTop = new Border(new Vector(0, 0), canvasWidth *2, 40, "black");
        this.BorderDown = new Border(new Vector(0, canvasHeight ), canvasWidth*2, 40, "black");
        this.BorderLeft = new Border(new Vector(0, 0), 40, canvasHeight * 2, "black");
        this.BorderRight = new Border(new Vector(canvasWidth, canvasHeight ), 40, canvasHeight*2, "black");
        

        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2), 20, 20, "black");

        this.actors = [
            this.paddleLeft,
            this.paddleRight,
            this.ball,
            this.BorderTop,
            this.BorderDown,
            this.BorderLeft,
            this.BorderRight
        ];
    }

    draw(ctx) {
        this.scoreLabelLeft.draw(ctx, this.scoreleft)       
        this.scoreLabelRight.draw(ctx, this.scoreright);

        for (let actor of this.actors) {
            actor.draw(ctx);
        }

    }

    update(deltaTime) {
        // Move the player
        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);
        this.ball.update(deltaTime);

        // Detect collision with the paddles
        if (boxOverlap(this.paddleLeft, this.ball) || boxOverlap(this.paddleRight, this.ball)) {
            this.ball.velocity.x *= -1;
            ballSpeed *= speedIncrease
        }
        if (boxOverlap(this.BorderDown, this.ball) || boxOverlap(this.BorderTop, this.ball)) {
            this.ball.velocity.y *= -1
            ballSpeed *= speedIncrease

        }
        if (boxOverlap(this.BorderLeft, this.ball)) {
            this.ball.reset();
            this.scoreright +=1
        }
        if (boxOverlap(this.BorderRight, this.ball)) {
            this.ball.reset();
            this.scoreleft +=1
        }
    }

    addBox() {
        // TODO: Use the randomRange function to make these values different
        // Create boxes with minimum size 50, and up to 50 pixels more
        const size = 50;
        // Define a random position for the box, within the canvas
        const posX = 60;
        const posY = 70;
        const box = new GameObject(new Vector(posX, posY), size, size, "grey");
        // Set a property to indicate if the box should be destroyed or not
        box.destroy = false;
        this.actors.push(box);
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'w') {
                this.addKey('up', this.paddleLeft);
            } else if (event.key == 's') {
                this.addKey('down', this.paddleLeft);
            } else if (event.key == 'ArrowUp') {
                this.addKey('up', this.paddleRight);
            } else if (event.key == 'ArrowDown') {
                this.addKey('down', this.paddleRight);
            } else if (event.key == ' ') {
                this.ball.serve();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.delKey('up', this.paddleLeft);
            } else if (event.key == 's') {
                this.delKey('down', this.paddleLeft);
            } else if (event.key == 'ArrowUp') {
                this.delKey('up', this.paddleRight);
            } else if (event.key == 'ArrowDown') {
                this.delKey('down', this.paddleRight);
            }
        });

        
    }

    updateCPU(deltaTime) {
        let paddleCenter = this.paddleRight.position.y + (this.paddleRight.height / 2);
        let ballCenter = this.ball.position.y + (this.ball.height / 2);
        
if (ballCenter < paddleCenter) {
        this.paddleRight.velocity.y = -1;
    } 
    // Si es mayor, debe bajar
    else if (ballCenter > paddleCenter) {
        this.paddleRight.velocity.y = 1;
    } else {
        this.paddleRight.velocity.y = 0;
    }

        this.paddleRight.position.y += this.paddleRight.velocity.y * paddleSpeed * deltaTime;
        this.paddleRight.clampWithinCanvas();
    }


    addKey(direction, object) {
        if (!object.keys.includes(direction)) {
            object.keys.push(direction);
        }
    }

    delKey(direction, object) {
        if (object.keys.includes(direction)) {
            object.keys.splice(object.keys.indexOf(direction), 1);
        }
    }
}



// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = 1;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}