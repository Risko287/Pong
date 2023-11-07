var canvas = document.getElementById('gameCanvas'),
    canvasContext = canvas.getContext('2d'),
    ballPositionX = canvas.width/2,
    ballPositionY = canvas.height/2,
    ballSize = 20,
    ballVelocityX = 8,
    ballVelocityY = 0,
    fps = 60,
    wallSize = 10,
    paddleWidth = 20,
    paddleHeight = 100,
    paddleOneY = 250,
    paddleOneDirectionY = null,
    paddleOneVelocityY = 15,
    paddleTwoY = 250,
    paddleTwoDirectionY = null,
    paddleTwoVelocityY = 10,
    playerOneScore = 0,
    playerTwoScore = 0,
    name = "",
    nameInput = document.getElementById("nameInput"),
    startMenu = document.getElementById('startMenu'),
    pauseMenu = document.getElementById('pauseMenu'),
    gameOverMenu = document.getElementById('gameOverMenu'),
    gameplay = document.getElementById('gameplay'),
    startBtn = document.getElementById('startBtn'),
    continueBtn = document.getElementById('continueBtn'),
    restartBtn = document.getElementById('restartBtn'),
    againBtn = document.getElementById('againBtn'),
    gameMessage = document.getElementById('gameMessage'),
    gamePaused = false,
    gameInProgress = false,
    scoreToWin = 10,
    difficultyLevel = 1,
    gameInterval = window.setInterval(function() {});

canvas.width = 800;
canvas.height = 600;
ballPositionY = canvas.height/2 - ballSize/2
paddleOneY = canvas.height/2 - paddleHeight/2;
paddleTwoY = canvas.height/2 - paddleHeight/2;
ballVelocityY = getRandomNumber(-5,5) * (.25 * difficultyLevel),

    //window.addEventListener('resize', windowResize);
startBtn.addEventListener('click', startGame);
continueBtn.addEventListener('click', resumeGame);
restartBtn.addEventListener('click', resetGame);
againBtn.addEventListener('click', resetGame);


startMenu.className = 'active';
pauseMenu.className = '';
gameplay.className = '';
gameOverMenu.className = '';

window.onblur = function() {
    //if(gameInProgress) pauseGame();
}

function startGame() {
    //sendScore(playerTwoScore);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    name = nameInput.value;
    gameInProgress = true;
    gameplay.className = '';
    startMenu.className = '';
    gameOverMenu.className = '';
    pauseMenu.className = '';
    gamePaused = false;
    gameInterval = window.setInterval(function() {
        moveEverything();
        if (id == 1) sendData(playerTwoScore, paddleOneY, paddleTwoY, ballPositionX, ballPositionY);
        //if (id == 2) sendDataP2(playerOneScore, paddleTwoY);
        drawEverything();
    }, 16);
}

function resetGame() {
    playerOneScore = 0;
    playerTwoScore = 0;
    difficultyLevel = 1,
        ballPositionX = canvas.width/2 - ballSize/2;
    ballPositionY = canvas.height/2 - ballSize/2;
    paddleOneY = canvas.height/2 - paddleHeight/2;
    paddleTwoY = canvas.height/2 - paddleHeight/2;
    ballVelocityY = getRandomNumber(-5,5) * (.25 * difficultyLevel),
        startGame();
}

function togglePause() {
    if(gamePaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function pauseGame() {
    if(!gamePaused) {
        gamePaused = true;
        gameplay.className = '';
        pauseMenu.className = 'active';
        clearInterval(gameInterval);
    }
}

function resumeGame() {
    if(gamePaused) {
        gamePaused = false;
        gameplay.className = '';
        pauseMenu.className = '';
        startGame();
    }
}

function windowResize() {
    resetBall();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawEverything();
}

function keyDown(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 13:
            if(gameInProgress) togglePause();
            break;
        case 38:
            if(!gamePaused && id == 1) paddleOneDirectionY = 'up';
            if(!gamePaused && id == 2) paddleTwoDirectionY = 'up';
            break;
        case 40:
            if(!gamePaused && id == 1) paddleOneDirectionY = 'down';
            if(!gamePaused && id == 2) paddleTwoDirectionY = 'down';
            break;
    }
}

function keyUp(e) {
    if (id == 1) paddleOneDirectionY = null;
    if (id == 2) paddleTwoDirectionY = null;
}

function resetBall() {
    ballVelocityX = -ballVelocityX;
    ballVelocityY = getRandomNumber(-5,5) * (.25 * difficultyLevel);
    ballPositionX = canvas.width/2;
    ballPositionY = canvas.height/2;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomizeGame() {
    //paddleTwoVelocityY = getRandomNumber(10,20) * (.25 * difficultyLevel);
}

function gameOver(playerWon) {
    gameInProgress = false;
    clearInterval(gameInterval);
    gameMessage.textContent = '';
    againBtn.textContent = '';
    if(playerWon) {
        gameMessage.textContent = 'You won!';
        againBtn.textContent = 'Play again';
    } else {
        gameMessage.textContent = 'Oh snap, you lost.';
        againBtn.textContent = 'Try again';
    }
    gameplay.className = '';
    gameOverMenu.className = 'active';
}

const playerOneZone = {
    x: 0,           //počiatočná x-súradnica
    y: canvas.height/2 - 250,           //počiatočná y-súradnica
    width: 20,      //šírka zóny
    height: 500  //výška zóny (zhodná s výškou canvasu)
};
let playerTwoZone = {
    x: canvas.width - 20,   //x-súradnica vpravo (šírka zóny = 10)
    y: canvas.height/2 - 250,                  //počiatočná y-súradnica
    width: 20,             //šírka zóny
    height: 500 //výška zóny (zhodná s výškou canvasu)
};

//playerTwoZone = [0,0,0,0];

function checkCollisionWithPlayerZone() {
    //kontrola pre hráča 1
    if(ballPositionX <= playerOneZone.x + playerOneZone.width &&
        ballPositionY >= playerOneZone.y &&
        ballPositionY <= playerOneZone.y + playerOneZone.height) {
        playerTwoScore++;  //pridáme bod pre hráča 1
        resetBall();       //zresetujeme loptičku
    }

    //kontrola pre hráča 2
    if(ballPositionX >= playerTwoZone.x &&
        ballPositionY >= playerTwoZone.y &&
        ballPositionY <= playerTwoZone.y + playerTwoZone.height) {
        playerOneScore++;  //pridáme bod pre hráča 2
        resetBall();       //zresetujeme loptičku
    }
}

function moveEverything() {
    ballPositionX = ballPositionX + ballVelocityX;

    checkCollisionWithPlayerZone();

    if(ballPositionX > canvas.width - paddleWidth*2 - ballSize/2 - wallSize) {
        if(ballPositionY >= paddleTwoY && ballPositionY <= paddleTwoY + paddleHeight && ballPositionX < canvas.width - paddleWidth) {
            ballVelocityX = -ballVelocityX;
            if(ballPositionY >= paddleTwoY &&
                ballPositionY < paddleTwoY + paddleHeight*.2) {
                ballVelocityY = -15 * (.25 * difficultyLevel);
            } else if(ballPositionY >= paddleTwoY + paddleHeight*.2 &&
                ballPositionY < paddleTwoY + paddleHeight*.4) {
                ballVelocityY = -10 * (.25 * difficultyLevel);
            } else if(ballPositionY >= paddleTwoY + paddleHeight*.4 &&
                ballPositionY < paddleTwoY + paddleHeight*.6) {
                ballVelocityY = 0
            } else if(ballPositionY >= paddleTwoY  + paddleHeight*.6 &&
                ballPositionY < paddleTwoY + paddleHeight*.8) {
                ballVelocityY = 10 * (.25 * difficultyLevel);
            } else if(ballPositionY >= paddleTwoY + paddleHeight*.8 &&
                ballPositionY < paddleTwoY + paddleHeight) {
                ballVelocityY = 15 * (.25 * difficultyLevel);
            }
        } else if(ballPositionX > canvas.width) {
            // resetBall();
            // playerOneScore++;
            // difficultyLevel = playerOneScore*.5;
            // if(playerOneScore === scoreToWin) gameOver(true);
        }
        //randomizeGame();
    } else if(ballPositionX < paddleWidth*2 + ballSize/2) {
        if(ballPositionY >= paddleOneY &&
            ballPositionY <= paddleOneY + paddleHeight &&
            ballPositionX > paddleWidth + ballSize/2) {
            ballVelocityX = -ballVelocityX;
            if(ballPositionY >= paddleOneY &&
                ballPositionY < paddleOneY + paddleHeight*.2) {
                ballVelocityY = -20 * (.25 * difficultyLevel);
            } else if(ballPositionY >= paddleOneY + paddleHeight*.2 &&
                ballPositionY < paddleOneY + paddleHeight*.4) {
                ballVelocityY = -10 * (.25 * difficultyLevel);
            } else if(ballPositionY >= paddleOneY + paddleHeight*.4 &&
                ballPositionY < paddleOneY + paddleHeight*.6) {
                ballVelocityY = 0;
            } else if(ballPositionY >= paddleOneY  + paddleHeight*.6 &&
                ballPositionY < paddleOneY + paddleHeight*.8) {
                ballVelocityY = 10 * (.25 * difficultyLevel);
            } else if(ballPositionY >= paddleOneY + paddleHeight*.8 &&
                ballPositionY < paddleOneY + paddleHeight) {
                ballVelocityY = 20 * (.25 * difficultyLevel);
            }
        } else if(ballPositionX <= -ballSize) {
            // resetBall();
            // playerTwoScore++;
            // if(playerTwoScore === scoreToWin) gameOver(false);
        }
        //randomizeGame();
    }
    //ballPositionX = ballPositionX + ballVelocityX;
    if(ballPositionX > canvas.width - ballSize/2 - wallSize) {
        ballVelocityX = -ballVelocityX;
        ballPositionX = canvas.width - ballSize/2 - wallSize;
    } else if(ballPositionX < ballSize/2 + wallSize) {
        ballVelocityX = -ballVelocityX;
        ballPositionX = ballSize/2 + wallSize;
    }

    ballPositionY = ballPositionY + ballVelocityY;
    if(ballPositionY > canvas.height - ballSize/2 - wallSize) {
        ballVelocityY = -ballVelocityY;
        ballPositionY = canvas.height - ballSize/2 - wallSize;
    } else if(ballPositionY < ballSize/2 + wallSize) {
        ballVelocityY = -ballVelocityY;
        ballPositionY = ballSize/2 + wallSize;
    }

    if(paddleOneDirectionY === 'up' && paddleOneY >= 0) {
        paddleOneY = paddleOneY - paddleOneVelocityY;
    } else if(paddleOneDirectionY === 'down' &&
        paddleOneY < (canvas.height - paddleHeight) ) {
        paddleOneY += paddleOneVelocityY;
    }

    if(paddleTwoDirectionY === 'up' && paddleTwoY >= 0) {
        paddleTwoY = paddleTwoY - paddleTwoVelocityY;
    } else if(paddleTwoDirectionY === 'down' &&
        paddleTwoY < (canvas.height - paddleHeight) ) {
        paddleTwoY += paddleTwoVelocityY;
    }

/*
    if(ballPositionY < paddleTwoY) {
        paddleTwoY -= paddleTwoVelocityY;
    } else if(ballPositionY > paddleTwoY + paddleHeight) {
        paddleTwoY += paddleTwoVelocityY;
    }
*/
}
function drawPlayerZones() {
    //hráč 1
    canvasContext.fillStyle = "#ff0101";
    canvasContext.fillRect(playerOneZone.x, playerOneZone.y, playerOneZone.width, playerOneZone.height);

    //hráč 2
    canvasContext.fillStyle = "#0eeab3";
    canvasContext.fillRect(playerTwoZone.x, playerTwoZone.y, playerTwoZone.width, playerTwoZone.height);
}

function drawEverything() {
    //drawPlayerZones();
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    // canvasContext.fillStyle = 'black';
    // canvasContext.fillRect(0,0,canvas.width,canvas.height);
    // canvasContext.fillStyle = '#ff0101';
    // canvasContext.fillRect(playerOneZone.x, playerOneZone.y, playerOneZone.width, playerOneZone.height);
    //
    // //hráč 2
    // canvasContext.fillStyle = '#0eeab3';
    // canvasContext.fillRect(playerTwoZone.x, playerTwoZone.y, playerTwoZone.width, playerTwoZone.height);

    drawPlayerZones();
    canvasContext.fillStyle = '#edeae5';

    canvasContext.fillRect(0, 0, canvas.width, wallSize);
    canvasContext.fillRect(0, canvas.height - wallSize, canvas.width, wallSize);
    //canvasContext.fillRect(0, canvas.height - wallSize, wallSize, canvas.width);
    canvasContext.fillRect(0, 0, wallSize, canvas.height);
    canvasContext.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

    canvasContext.fillStyle = 'white';
    canvasContext.beginPath();
    canvasContext.arc(ballPositionX, ballPositionY, ballSize/2, 0, Math.PI*2, true);
    canvasContext.fill();

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(paddleWidth,paddleOneY,paddleWidth,paddleHeight); // x, y, w, h

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(canvas.width - paddleWidth - paddleWidth,paddleTwoY,paddleWidth,paddleHeight); // x, y, w, h

    canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
    canvasContext.font = "60px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(id + name,canvas.width*.25,canvas.height/2 - 175);

    canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
    canvasContext.font = "200px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(playerOneScore,canvas.width*.25,canvas.height/2 + 75);

    canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
    canvasContext.font = "200px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(playerTwoScore,canvas.width*.75,canvas.height/2 + 75);

    canvasContext.strokeStyle = 'rgba(255,255,255,0.2)';
    canvasContext.beginPath();
    canvasContext.moveTo(canvas.width/2,0);
    canvasContext.lineTo(canvas.width/2,canvas.height);
    canvasContext.stroke();
}

function changeEverything(data) {
    playerTwoScore = data.score;  //pridáme bod pre hráča 1
    paddleOneY = data.paddleOneY;
    paddleTwoY = data.paddleTwoY;
    if (id == 2){
        ballPositionX = data.ballX;
        ballPositionY = data.ballY;
    }

}