const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Center the square
    square.x = (canvas.width - square.size) / 2;
    square.y = (canvas.height - square.size) / 2;

    // Adjust bottomLeftSquare position
    bottomLeftSquare.y = canvas.height - bottomLeftSquare.height;
}

const balls = [];
const gravity = 0.5;
const friction = 0.9;
const ballLifetime = 5000; // Ball lifetime in milliseconds

const square = {
    x: 0, // Will be adjusted in resizeCanvas
    y: 0, // Will be adjusted in resizeCanvas
    size: 100,
    color: 'blue'
};

const bottomLeftSquare = {
    x: 0,
    y: 0, // Will be adjusted in resizeCanvas
    width: 140*1.5,
    height: 120*1.5,
    color: 'red'
};

// Load the ball image
const ballImage = new Image();
ballImage.src = 'src/ball.png'; // Make sure to place the ball.png in the same directory

// Load the person image
const personImage = new Image();
personImage.src = 'src/person.png'; // Make sure to place the person.png in the same directory

// Load the magic hat image
const magichatImage = new Image();
magichatImage.src = 'src/magichat.png'; // Make sure to place the magichat.png in the same directory

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = Math.random() * 10 - 5; // Random horizontal speed
        this.dy = Math.random() * -15; // Random vertical speed (upwards)
        this.createdTime = Date.now(); // Record creation time
    }

    draw() {
        const size = this.radius * 2 * 2.3*1.5; // Increased size
        ctx.drawImage(ballImage, this.x - size / 2, this.y - size / 2, size, size);
    }

    update() {
        const currentTime = Date.now();
        
        // Remove ball if its lifetime has elapsed
        if (currentTime - this.createdTime > ballLifetime) {
            balls.splice(balls.indexOf(this), 1);
            return;
        }

        // Check collision with bottom border
        if (this.y + this.radius + this.dy > canvas.height) {
            this.dy = -this.dy * friction;
        } else {
            this.dy += gravity;
        }

        // Check collision with side borders
        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
            this.dx = -this.dx * friction;
        }

        // Check collision with bottom-left square
        if (this.x + this.radius > bottomLeftSquare.x &&
            this.x - this.radius < bottomLeftSquare.x + bottomLeftSquare.width &&
            this.y + this.radius > bottomLeftSquare.y &&
            this.y - this.radius < bottomLeftSquare.y + bottomLeftSquare.height) {

            // Determine which side the collision occurred
            const ballBottom = this.y + this.radius;
            const ballTop = this.y - this.radius;
            const ballLeft = this.x - this.radius;
            const ballRight = this.x + this.radius;

            const squareBottom = bottomLeftSquare.y + bottomLeftSquare.height;
            const squareTop = bottomLeftSquare.y;
            const squareLeft = bottomLeftSquare.x;
            const squareRight = bottomLeftSquare.x + bottomLeftSquare.width;

            const collideTop = ballBottom > squareTop && ballTop < squareTop;
            const collideBottom = ballTop < squareBottom && ballBottom > squareBottom;
            const collideLeft = ballRight > squareLeft && ballLeft < squareLeft;
            const collideRight = ballLeft < squareRight && ballRight > squareRight;

            if (collideTop) {
                this.dy = -this.dy * friction;
                this.y = squareTop - this.radius;
            } else if (collideBottom) {
                this.dy = -this.dy * friction;
                this.y = squareBottom + this.radius;
            } else if (collideLeft) {
                this.dx = -this.dx * friction;
                this.x = squareLeft - this.radius;
            } else if (collideRight) {
                this.dx = -this.dx * friction;
                this.x = squareRight + this.radius;
            }
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

function drawSquare() {
    // Draw the magic hat image instead of a blue square
    ctx.drawImage(magichatImage, square.x, square.y, square.size, square.size);
}

function drawBottomLeftSquare() {
    ctx.drawImage(personImage, bottomLeftSquare.x, bottomLeftSquare.y, bottomLeftSquare.width, bottomLeftSquare.height);
}

function addBall(x, y) {
    const radius = 20;
    balls.push(new Ball(x, y, radius));
}

function init() {
    balls.length = 0; // Clear previous balls
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquare();
    drawBottomLeftSquare();
    balls.forEach(ball => ball.update());
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (
        x > square.x &&
        x < square.x + square.size &&
        y > square.y &&
        y < square.y + square.size
    ) {
        addBall(square.x + square.size / 2, square.y + square.size / 2);
    }
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

personImage.onload = () => {
    init();
    animate();
};
