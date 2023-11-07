var canvas = document.getElementById('gameCanvas'),
    canvasContext = canvas.getContext('2d'),
    ballPositionX = canvas.width/2,
    ballPositionY = canvas.height/2,
    ballSize = 20,
    ballVelocityX = 5,
    ballVelocityY = 0,
    wallSize = 10,
    paddleWidth = 20,
    paddleHeight = 100,
    paddleOneY = 250,
    paddleOneDirectionY = null,
    paddleOneVelocityY = 15,
    paddleTwoY = 250,
    paddleTwoDirectionY = null,
    paddleTwoVelocityY = 10,
    paddleThreeX = 400,
    paddleThreeDirectionX = null,
    paddleFourX = 400,
    paddleFourDirectionX = null,
    playerOneScore = 3,
    playerTwoScore = 3,
    playerThreeScore = 3,
    playerFourScore = 3,
    playerOneLive = false,
    playerTwoLive = false,
    playerThreeLive = false,
    playerFourLive = false,
    name = "",
    nameOne = "",
    nameTwo = "",
    nameThree = "",
    nameFour = "",
    nameInput = document.getElementById("nameInput"),
    playerCounter = document.getElementById("playerCounter"),
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
    gameInterval = window.setInterval(function() {}),
    id,
    first = true,
    num,
    bounce = 0,
    gameOver = false;

canvas.width = 800;
canvas.height = 600;
ballPositionY = canvas.height/2 - ballSize/2
paddleOneY = canvas.height/2 - paddleHeight/2;
paddleTwoY = canvas.height/2 - paddleHeight/2;
paddleThreeX = canvas.width/2 - paddleWidth/2;
paddleFourX = canvas.width/2 - paddleWidth/2;
ballVelocityY = getRandomNumber(-5,5);

    //window.addEventListener('resize', windowResize);
startBtn.addEventListener('click', function () {
    if (id == 1) startGame();
});
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


var ws = new WebSocket("wss://site227.webte.fei.stuba.sk:9000");
$(document).ready(function () {
    ws.onopen = function () { console.log("Connection established");
        //var canvas = document.getElementById('gameCanvas');
        //sendData(0, 250, 250, canvas.width/2, canvas.height/2 );
    };
    ws.onerror = function (error) { console.log("Unknown WebSocket Error " + JSON.stringify(error)); };
    ws.onmessage = function (e) {  var data = JSON.parse(e.data);
        console.log(data);
        id = data.id;
        num = data.num;
        playerCounter.innerHTML = "Players: " + num;
        if (data.start && first){
            startGame();
            first = false;
        }
        
        readFromServer(data);
    };
    ws.onclose = function () { console.log("Connection closed - Either the host or the client has lost connection"); }
});

function sendToServer(paddleOneDirectionY, name) {
    try {
        // zakódovanie dát do formátu JSON
        const data = JSON.stringify({paddleOneDirectionY: paddleOneDirectionY, nameOne: name });

        // odoslanie dát na server
        ws.send(data);
        //ws.send(playerScore);

        //console.log('> Odoslané na server: ' + data);
    } catch (exception) {
        console.log(exception);
    }
}

function readFromServer(data){
    ballPositionX = data.ballX;
    ballPositionY = data.ballY;
    playerOneScore = data.playerOneScore;
    playerTwoScore = data.playerTwoScore;
    playerThreeScore = data.playerThreeScore;
    playerFourScore = data.playerFourScore;
    paddleOneY = data.paddleOneY;
    paddleTwoY = data.paddleTwoY;
    paddleThreeX = data.paddleThreeX;
    paddleFourX = data.paddleFourX;
    nameOne = data.nameOne;
    nameTwo = data.nameTwo;
    nameThree = data.nameThree;
    nameFour = data.nameFour;
    playerOneLive = data.playerOneLive;
    playerTwoLive = data.playerTwoLive;
    playerThreeLive = data.playerThreeLive;
    playerFourLive = data.playerFourLive;
    gameOver = data.gameOver;
    bounce = data.bounce;

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
    sendToServer(paddleOneDirectionY, name);
    gameInterval = window.setInterval(function() {
        //moveEverything();
        //if (id == 1) sendData(playerTwoScore, paddleOneY, paddleTwoY, ballPositionX, ballPositionY);
        //if (id == 2) sendDataP2(playerOneScore, paddleTwoY);
        drawEverything();
    }, 16);
}

function resetGame() {
    playerOneScore = 0;
    playerTwoScore = 0;
    ballPositionX = canvas.width/2 - ballSize/2;
    ballPositionY = canvas.height/2 - ballSize/2;
    paddleOneY = canvas.height/2 - paddleHeight/2;
    paddleTwoY = canvas.height/2 - paddleHeight/2;
    ballVelocityY = getRandomNumber(-5,5);
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
function keyDown(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 13:
            if(gameInProgress) togglePause();
            break;
        case 38:
            if(!gamePaused && id == 1) paddleOneDirectionY = 'up';
            if(!gamePaused && id == 2) paddleTwoDirectionY = 'up';
            if(!gamePaused && id == 3) paddleThreeDirectionX = 'up';
            if(!gamePaused && id == 4) paddleFourDirectionX = 'up';
            break;
        case 40:
            if(!gamePaused && id == 1) paddleOneDirectionY = 'down';
            if(!gamePaused && id == 2) paddleTwoDirectionY = 'down';
            if(!gamePaused && id == 3) paddleThreeDirectionX = 'down';
            if(!gamePaused && id == 4) paddleFourDirectionX = 'down';
            break;
    }
    if (id == 1) sendToServer(paddleOneDirectionY, name);
    if (id == 2) sendToServer(paddleTwoDirectionY, name);
    if (id == 3) sendToServer(paddleThreeDirectionX, name);
    if (id == 4) sendToServer(paddleFourDirectionX, name);
}

function keyUp(e) {
    if (id == 1) {
        paddleOneDirectionY = null;
        sendToServer(paddleOneDirectionY, name);
    }
    if (id == 2) {
        paddleTwoDirectionY = null;
        sendToServer(paddleTwoDirectionY, name);
    }
    if (id == 3) {
        paddleThreeDirectionX = null;
        sendToServer(paddleThreeDirectionX, name);
    }
    if (id == 4) {
        paddleFourDirectionX = null;
        sendToServer(paddleFourDirectionX, name);
    }
}

function resetBall() {
    ballVelocityX = -ballVelocityX;
    ballVelocityY = getRandomNumber(-5,5);
    ballPositionX = canvas.width/2;
    ballPositionY = canvas.height/2;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
/*
function gameOver() {
    gameInProgress = false;
    clearInterval(gameInterval);
    gameMessage.textContent = '';
    againBtn.textContent = '';
    gameMessage.textContent = 'GAME OVER!';
    // if(playerWon) {
    //     gameMessage.textContent = 'You won!';
    //     againBtn.textContent = 'Play again';
    // } else {
    //     gameMessage.textContent = 'Oh snap, you lost.';
    //     againBtn.textContent = 'Try again';
    // }
    gameplay.className = '';
    gameOverMenu.className = 'active';
}
*/
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
const playerThreeZone = {
    x: canvas.width/2 - 250,           //počiatočná x-súradnica
    y: 0,           //počiatočná y-súradnica
    width: 500,      //šírka zóny
    height: 20  //výška zóny (zhodná s výškou canvasu)
};
const playerFourZone = {
    x: canvas.width/2 - 250,           //počiatočná x-súradnica
    y: canvas.height - 20,           //počiatočná y-súradnica
    width: 500,      //šírka zóny
    height: 20  //výška zóny (zhodná s výškou canvasu)
};

//playerTwoZone = [0,0,0,0];
/*
function checkCollisionWithPlayerZone() {
    //kontrola pre hráča 1
    if(ballPositionX <= playerOneZone.x + playerOneZone.width && ballPositionY >= playerOneZone.y &&
        ballPositionY <= playerOneZone.y + playerOneZone.height) {
        playerTwoScore++;  //pridáme bod pre hráča 1
        resetBall();       //zresetujeme loptičku
    }

    //kontrola pre hráča 2
    if(ballPositionX >= playerTwoZone.x && ballPositionY >= playerTwoZone.y &&
        ballPositionY <= playerTwoZone.y + playerTwoZone.height) {
        playerOneScore++;  //pridáme bod pre hráča 2
        resetBall();       //zresetujeme loptičku
    }
}

function moveEverything() {
    ballPositionX = ballPositionX + ballVelocityX;

    checkCollisionWithPlayerZone();
    // check player two side
    if (ballPositionX > canvas.width - paddleWidth * 2 - ballSize / 2 - wallSize) {
        if (ballPositionY >= paddleTwoY && ballPositionY <= paddleTwoY + paddleHeight && ballPositionX < canvas.width - paddleWidth) {
            ballVelocityX = -ballVelocityX;
            ballVelocityY = getRandomNumber(-3, 3);
        }
    } else if (ballPositionX < paddleWidth * 2 + ballSize / 2 + wallSize) {
        if (ballPositionY >= paddleOneY && ballPositionY <= paddleOneY + paddleHeight && ballPositionX > paddleWidth + ballSize / 2) {
            ballVelocityX = -ballVelocityX;
            ballVelocityY = getRandomNumber(-3, 3);
        }
    }
    // check left and right wall
    if (ballPositionX > canvas.width - ballSize / 2 - wallSize) {
        ballVelocityX = -ballVelocityX;
        ballPositionX = canvas.width - ballSize / 2 - wallSize;
    } else if (ballPositionX < ballSize / 2 + wallSize) {
        ballVelocityX = -ballVelocityX;
        ballPositionX = ballSize / 2 + wallSize;
    }
    // check up and down wall
    ballPositionY = ballPositionY + ballVelocityY;
    if (ballPositionY > canvas.height - ballSize / 2 - wallSize) {
        ballVelocityY = -ballVelocityY;
        ballPositionY = canvas.height - ballSize / 2 - wallSize;
    } else if (ballPositionY < ballSize / 2 + wallSize) {
        ballVelocityY = -ballVelocityY;
        ballPositionY = ballSize / 2 + wallSize;
    }

    // move paddle one
    if (paddleOneDirectionY === 'up' && paddleOneY >= 0) {
        paddleOneY = paddleOneY - paddleOneVelocityY;
    } else if (paddleOneDirectionY === 'down' && paddleOneY < (canvas.height - paddleHeight - wallSize)) {
        paddleOneY += paddleOneVelocityY;
    }
    // move paddle two
    if (paddleTwoDirectionY === 'up' && paddleTwoY >= 0) {
        paddleTwoY = paddleTwoY - paddleTwoVelocityY;
    } else if (paddleTwoDirectionY === 'down' && paddleTwoY < (canvas.height - paddleHeight - wallSize)) {
        paddleTwoY += paddleTwoVelocityY;
    }
}

/*  BOT

    if(ballPositionY < paddleTwoY) {
        paddleTwoY -= paddleTwoVelocityY;
    } else if(ballPositionY > paddleTwoY + paddleHeight) {
        paddleTwoY += paddleTwoVelocityY;
    }
*/

function drawPlayerZones() {
    //hráč 1
    if (playerOneLive) {
        canvasContext.fillStyle = "#ff0101";
        canvasContext.fillRect(playerOneZone.x, playerOneZone.y, playerOneZone.width, playerOneZone.height);
        //paddle 1
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(paddleWidth, paddleOneY, paddleWidth, paddleHeight); // x, y, w, h

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "60px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(nameOne, canvas.width * .25 - 25, canvas.height / 2);

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "100px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(playerOneScore, canvas.width * .25 - 25, canvas.height / 2 + 75);
    }
    //hráč 2
    if (playerTwoLive) {
        canvasContext.fillStyle = "#0eea5b";
        canvasContext.fillRect(playerTwoZone.x, playerTwoZone.y, playerTwoZone.width, playerTwoZone.height);
        //paddle 2
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(canvas.width - paddleWidth - paddleWidth,paddleTwoY,paddleWidth,paddleHeight); // x, y, w, h

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "60px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(nameTwo,canvas.width*.75 + 25,canvas.height/2);

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "100px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(playerTwoScore,canvas.width*.75 + 25,canvas.height/2 + 75);
    }

    //hráč 3
    if (playerThreeLive) {
        canvasContext.fillStyle = "#ffea01";
        canvasContext.fillRect(playerThreeZone.x, playerThreeZone.y, playerThreeZone.width, playerThreeZone.height);
        //paddle 3
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(paddleThreeX,paddleWidth,paddleHeight,paddleWidth); // x, y, w, h

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "60px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(nameThree,canvas.width/2,canvas.height*.25 - 25);

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "100px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(playerThreeScore,canvas.width/2,canvas.height*.25 + 50);
    }
    //hráč 4
    if (playerFourLive) {
        canvasContext.fillStyle = "#0105ff";
        canvasContext.fillRect(playerFourZone.x, playerFourZone.y, playerFourZone.width, playerFourZone.height);
        //paddle 4
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(paddleFourX,canvas.height - paddleWidth - paddleWidth,paddleHeight,paddleWidth); // x, y, w, h

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "60px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(nameFour,canvas.width/2,canvas.height*.25);

        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "100px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText(playerFourScore,canvas.width/2,canvas.height*.75 + 75);
    }
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

    canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
    canvasContext.font = "100px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(bounce,canvas.width/2,canvas.height/2 + 35);

    if (gameOver){
        canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
        canvasContext.font = "100px 'Roboto', Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText("Game Over",canvas.width/2,canvas.height/2 - 100);
    }
/*
    canvasContext.strokeStyle = 'rgba(255,255,255,0.2)';
    canvasContext.beginPath();
    canvasContext.moveTo(canvas.width/2,0);
    canvasContext.lineTo(canvas.width/2,canvas.height);
    canvasContext.stroke();

 */
}
/*
function changeEverything(data) {
    playerTwoScore = data.score;  //pridáme bod pre hráča 1
    paddleOneY = data.paddleOneY;
    paddleTwoY = data.paddleTwoY;
    if (id == 2){
        ballPositionX = data.ballX;
        ballPositionY = data.ballY;
    }

}
*/