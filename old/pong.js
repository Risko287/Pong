// definícia konštánt pre herné pole a loptičku
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 75;
const paddleWidth = 10;
const playerPaddleX = 10; // pozícia hráčovej pálky
let ballX = canvas.width/2; // pozícia loptičky na začiatku
let ballY = canvas.height/2;
let ballDX = 3; // rýchlosť loptičky v osi X a Y
let ballDY = -3;
let playerPaddleY = canvas.height/2 - paddleHeight/2; // pozícia hráčovej pálky na začiatku

// funkcia na kreslenie loptičky
function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
}

// funkcia na kreslenie hráčovej pálky
function drawPlayerPaddle() {
    context.beginPath();
    context.rect(playerPaddleX, playerPaddleY, paddleWidth, paddleHeight);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
}

// funkcia na detekciu zrážok s hráčovou pálkou
function playerPaddleCollision() {
    if (ballX + ballRadius >= playerPaddleX && ballY >= playerPaddleY && ballY <= playerPaddleY + paddleHeight) {
        ballDX = -ballDX;
    }
}

// funkcia na pohyb hráčovej pálky
function movePlayerPaddle(evt) {
    if (evt.keyCode === 38 && playerPaddleY > 0) { // šipka hore
        playerPaddleY -= 10;
    } else if (evt.keyCode === 40 && playerPaddleY + paddleHeight < canvas.height) { // šipka dole
        playerPaddleY += 10;
    }
}

// funkcia na pohyb loptičky
function moveBall() {
    ballX += ballDX;
    ballY += ballDY;

// detekcia zrážky s horným a dolným okrajom herného poľa
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballDY = -ballDY;
    }

// detekcia zrážky s hráčovou pálkou
    playerPaddleCollision();

// detekcia zrážky s bočnými okrajmi herného poľa
    if (ballX - ballRadius <= playerPaddleX + paddleWidth || ballX + ballRadius >= canvas.width) {
// resetovanie loptičky na stred herného poľa a zmena smeru
        ballX = canvas.width/2;
        ballY = canvas.height/2;
        ballDX = -ballDX;
        ballDY = -ballDY;
    }
}

// funkcia pre animáciu hry
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); // vymazanie canvasu
    drawBall(); // nakreslenie loptičky
    drawPlayerPaddle(); // nakreslenie hráčovej pálky
    moveBall(); // pohyb loptičky
    requestAnimationFrame(animate); // rekurzívne volanie animate pre plynulú animáciu
}

// pridanie event listenerov na pohyb hráčovej pálky
document.addEventListener('keydown', movePlayerPaddle);
document.addEventListener('keyup', movePlayerPaddle);

// spustenie animácie
animate();