/*
this.ba * Detection of collisions between boxes
 *
 * Oscar Lara
 * 2026-05-09
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

//Table
const tableSprite = new Image();
tableSprite.src = '../assets/sprites/tablepong.png';

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let ballSpeed = 10;
let paddleSpeed = 12;
let speedIncrease = 1.5;

// sprites
const PATH_BALL = '../assets/sprites/ball.png';
const PATH_PADDLE = '../assets/sprites/paddle.png';
const PATH_BLOCKS = '../assets/sprites/cup.png'; 
const PATH_POWERUP = '../assets/sprites/taco.png';
const PATH_CHIPS = '../assets/sprites/chips.png';
// sonidos
const ballSound = new Audio('../assets/audio/Ball.mp3');
const bellSound = new Audio('../assets/audio/Bell.mp3');
const eatSound = new Audio('../assets/audio/Eat.mp3');

function playSound(audio) {
    audio.currentTime = 0; 
    audio.play();
}

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
        this.position.y = canvasHeight - 100;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    serve() {
                this.position = new Vector(canvasWidth / 2, canvasHeight - 100);
                this.velocity = new Vector(1, 1);
    }
}

// Class for Paddle
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols, lives) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);
        this.lives = lives;

        this.motion = {
            up: {
                axis: "x",
                sign: -1,
            },
            down: {
                axis: "x",
                sign: 1,
            }
        }
        // Keys pressed to move the player
        this.keys = [];
        let halfSize = height / 2
    }

    reset() {
        this.position.x = canvasWidth / 2;
        this.position.y = canvasHeight - 50;
        this.velocity.x = 0;
        this.velocity.y = 0;
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
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x + 40;
        }
        if (this.position.x + this.halfSize.x > canvasWidth){
            this.position.x = canvasWidth - this.halfSize.x - 40;
        }
    }
}

// Class for PowerUps
class PowerUp extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "powerup", sheetCols);
        this.velocity = new Vector(0, 1);
        this.motion = {
            up: {
                axis: "x",
                sign: 0,
            },
            down: {
                axis: "x",
                sign: 0.5,
            }
        }
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(ballSpeed).times(deltaTime));
        this.updateCollider();
    }

    spawn() {
                this.position = new Vector(Math.random() * (canvasWidth - 20), 100);
                this.velocity = new Vector(0, 1);
    }

    collect() {
        this.position = new Vector(-100, -100);
        this.velocity = new Vector(0, 0);
    }

}

// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects()

        this.scoreleft = 0;
        this.level = 0;
        this.lastSpawnScore = 0;
        console.log(this.lastSpawnScore)

        this.livesLable = new TextLabel(1*canvasWidth/16, canvasHeight - 100, "40px Arial", "white")
        this.scoreLabelLeft = new TextLabel(1*canvasWidth/16, canvasHeight - 50, "40px Arial", "white")
        this.GameOverLable = new TextLabel(1*canvasWidth/2 - 180, canvasHeight / 2, "80px Arial", "white")
        this.levelLabel = new TextLabel(1*canvasWidth/16, canvasHeight - 150, "40px Arial", "white")

    }

    speedIncrease() {
        this.ballSpeed *= this.speedIncrease;
    }
    
    // Initialize the objects in the game
    initObjects() {

        this.PowerUpMult = new PowerUp(new Vector(canvasWidth / 2, 600), 20, 20, "yellow");
        this.PowerUpMult.setSprite(PATH_POWERUP);
        this.PowerUpMult.setScale(6);

        this.PowerUpDest = new PowerUp(new Vector(canvasWidth / 2, 600), 20, 20, "yellow");
        this.PowerUpDest.setSprite(PATH_CHIPS);
        this.PowerUpDest.setScale(6);

        this.BorderTop = new Border(new Vector(0, 0), canvasWidth *2, 40, "black");
        this.BorderDown = new Border(new Vector(0, canvasHeight ), canvasWidth*2, 40, "black");
        this.BorderLeft = new Border(new Vector(0, 0), 40, canvasHeight * 2, "black");
        this.BorderRight = new Border(new Vector(canvasWidth, canvasHeight ), 40, canvasHeight*2, "black");
        this.paddlePlayer = new Paddle(new Vector(canvasWidth / 2, canvasHeight - 50), 120, 40, "black", 3);
        this.paddlePlayer.setSprite(PATH_PADDLE);
        this.paddlePlayer.setScale(1.5);
        this.actors = [
            this.paddlePlayer,
            this.PowerUpMult,
            this.PowerUpDest, 
            this.BorderTop,
            this.BorderDown,
            this.BorderLeft,
            this.BorderRight
    ];

                this.paddlePlayer.lives = 3;

        // Create the initial ball
        this.balls = [];
        let ball1  = new Ball(new Vector(canvasWidth / 2, canvasHeight - 100), 20, 20, "red", 3);
        ball1.setSprite(PATH_BALL);
        ball1.setScale(1.5);
        this.balls.push(ball1);
        this.ball = this.balls[0];

        // Create the boxes
        this.boxes = [];
        for (let i = 0; i < 6; i++) {
            let posX = 80 + i * 128;
            for (let j = 0; j < this.level + 1; j++) {
                let colors = ["red", "orange", "green", "blue", "grey"];
                let posY = 50 + j * 60;
                let box = new Paddle(new Vector(posX, posY), 100, 40, colors[j]);
                box.setSprite(PATH_BLOCKS);
                box.setScale(1.5);
                this.boxes.push(box);
            }
        }
    }

    // Draw elements on screen
    draw(ctx) {
        ctx.drawImage(tableSprite, 0, 0, canvasWidth, canvasHeight);
        this.scoreLabelLeft.draw(ctx, "Score: " + this.scoreleft)       
        this.livesLable.draw(ctx, "Lives: " + this.paddlePlayer.lives)
        this.levelLabel.draw(ctx, "Level: " + this.level)
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        if (this.paddlePlayer.lives <= 0) {
            this.paddlePlayer.lives = 0;
            playSound(bellSound);
            this.GameOverLable.draw(ctx, "Game Over")
        }
        if (this.level == 9) {
            this.GameOverLable.draw(ctx, "You Win!")
        }

    }

    update(deltaTime) {

        // Spawn PowerUps
        if (this.scoreleft % 6 == 0 && this.scoreleft !== 0 && this.scoreleft !== this.lastSpawnScore) {
            this.PowerUpMult.spawn();
            this.lastSpawnScore = this.scoreleft; 
            console.log(this.lastSpawnScore)
            console.log(this.PowerUpMult.position)
        }
        if (this.scoreleft % 4 == 0 && this.scoreleft !== 0 && this.scoreleft !== this.lastSpawnScore) {
            this.PowerUpDest.spawn();
            this.lastSpawnScore = this.scoreleft; 
            console.log(this.lastSpawnScore)
            console.log(this.PowerUpDest.position)
        }
        
        // Move the player
        this.paddlePlayer.update(deltaTime);
        this.PowerUpMult.update(deltaTime);
        this.PowerUpDest.update(deltaTime);
        
        // Detect collision with the paddles
        for (let i = this.balls.length - 1; i >= 0; i--) {
            let ball = this.balls[i];
            ball.update(deltaTime);

            // Colisión con Paddle
            if (boxOverlap(this.paddlePlayer, ball)) {
                ball.velocity.y *= -1;
                playSound(ballSound);
            }
            // Colisión con Bordes
            if (boxOverlap(this.BorderTop, ball)) {
                ball.velocity.y *= -1;
                playSound(ballSound);
            }
            if (boxOverlap(this.BorderLeft, ball) || boxOverlap(this.BorderRight, ball)) {
                ball.velocity.x *= -1;
                playSound(ballSound);
            }
            // Muerte de Pelota (Borde Inferior)
            if (boxOverlap(this.BorderDown, ball)) {
                this.balls.splice(i, 1);
                playSound(bellSound);
                continue; 
            }

            // Colisión con Bloques (Boxes)
            for (let j = this.boxes.length - 1; j >= 0; j--) {
                let box = this.boxes[j];
                if (boxOverlap(box, ball)) {
                    this.boxes.splice(j, 1); 
                    ball.velocity.y *= -1;
                    playSound(ballSound);
                    this.scoreleft += 1;
                    break; 
                }
            }
        }
        
        // PowerUp collision with Paddle
        if (boxOverlap(this.PowerUpMult, this.paddlePlayer)) {
            let newBalls = [];
            this.PowerUpMult.collect();
                if (this.balls.length > 0) 
                for (let pelotaPadre of this.balls) {
                    let pos = pelotaPadre.position;                
                    let ball2 = new Ball(new Vector(pos.x, pos.y), 20, 20, "black", 3);
                    ball2.setSprite(PATH_BALL);
                            ball2.setScale(1.5);
                    ball2.velocity = new Vector(-1, -1);
                    let ball3 = new Ball(new Vector(pos.x, pos.y), 20, 20, "black", 3);
                    ball3.setSprite(PATH_BALL);
                    ball3.setScale(1.5);
                    ball3.velocity = new Vector(1, -0.5);
                    newBalls.push(ball2);
                    newBalls.push(ball3);
                }
            this.balls.push(...newBalls);
            playSound(eatSound);
        }
        if (boxOverlap(this.PowerUpDest, this.paddlePlayer)) {
            this.PowerUpDest.collect();
            if (this.boxes.length > 0) {
                for (let i = 0; i < 2; i++) {
                    this.boxes.splice(randomRange(0, this.boxes.length - 1), 1);
                    this.scoreleft += 1;
                }
            }
            playSound(eatSound);
        }

        // Respawn ball if all are lost and player has lives left
        if (this.balls.length === 0 && this.paddlePlayer.lives > 0) {
            this.paddlePlayer.lives -= 1;
            if (this.paddlePlayer.lives > 0) {
                let newBall = new Ball(new Vector(canvasWidth / 2, canvasHeight - 100), 20, 20, "red", 3);
                newBall.setSprite(PATH_BALL);
                newBall.setScale(1.5);
                newBall.velocity = new Vector(1, -1); 
                this.paddlePlayer.reset();
                this.balls.push(newBall);
            }
        
    }


        this.actors = [this.paddlePlayer, ...this.balls, this.PowerUpMult, this.PowerUpDest, this.BorderTop, this.BorderDown, this.BorderLeft, this.BorderRight, ...this.boxes];        this.checkLevelUp();

        this.checkLevelUp();
        
        if (this.level == 9 ) {
            this.GameOverLable.draw(ctx, "You Win!")
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
        this.actors.push(box);
    }

    
    // Create event listeners for the keyboard
    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'a') {
                this.addKey('up', this.paddlePlayer);
            } else if (event.key == 'd') {
                this.addKey('down', this.paddlePlayer);
            } else if (event.key == ' ') {
                this.ball.serve();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'a') {
                this.delKey('up', this.paddlePlayer);
            } else if (event.key == 'd') {
                this.delKey('down', this.paddlePlayer);
            } 
        });

        
    }

    // Check if all boxes are destroyed to level up
    checkLevelUp() {
        if (this.boxes.length == 0) {
            this.level += 1;
            this.initObjects();
        }
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

