<?php
//php server2.php start
use Workerman\Lib\Timer;
use Workerman\Worker;

require_once 'vendor/workerman/workerman/Autoloader.php';

$canvas = array(
    'width' => 800,
    'height' => 600
);
$ballPositionX = $canvas['width']/2;
$ballPositionY = $canvas['height']/2;
$ballSize = 20;
$ballVelocityX = 5;
$ballVelocityY = 0;
$wallSize = 10;
$paddleWidth = 20;
$paddleHeight = 100;
$paddleOneY = 250;
$paddleOneDirectionY = null;
$paddleOneVelocityY = 15;
$paddleTwoY = 250;
$paddleTwoDirectionY = null;
$paddleTwoVelocityY = 15;
$paddleThreeX = 250;
$paddleThreeDirectionX = null;
$paddleThreeVelocityX = 15;
$paddleFourX = 250;
$paddleFourDirectionX = null;
$paddleFourVelocityX = 15;
$playerOneScore = 3;
$playerTwoScore = 3;
$playerThreeScore = 3;
$playerFourScore = 3;
$nameOne = "";
$nameTwo = "";
$nameThree = "";
$nameFour = "";
$playerOneLive = false;
$playerTwoLive = false;
$playerThreeLive = false;
$playerFourLive = false;
$ballPositionY = $canvas['height']/2 - $ballSize/2;
$paddleOneY = $canvas['height']/2 - $paddleHeight/2;
$paddleTwoY = $canvas['height']/2 - $paddleHeight/2;
$paddleThreeX = $canvas['width']/2 - $paddleHeight/2;
$paddleFourX = $canvas['width']/2 - $paddleHeight/2;
$ballVelocityY = rand(-2,2);
$start = false;
$gameOver = false;
$num_cli = 0;
$bounce = 0;

function generateRandomNumberJsonMessage($data, $id)
{
    $time = date('h:i:s');
    $num = $GLOBALS['num_cli'];
    $msg = $GLOBALS['userdata'];

    $obj = new stdClass();
    $obj->paddleOneY = $GLOBALS['paddleOneY'];
    $obj->paddleTwoY = $GLOBALS['paddleTwoY'];
    $obj->paddleThreeX = $GLOBALS['paddleThreeX'];
    $obj->paddleFourX = $GLOBALS['paddleFourX'];
    $obj->ballX = $GLOBALS['ballPositionX'];
    $obj->ballY = $GLOBALS['ballPositionY'];
    $obj->nameOne = $GLOBALS['nameOne'];
    $obj->nameTwo = $GLOBALS['nameTwo'];
    $obj->nameThree = $GLOBALS['nameThree'];
    $obj->nameFour = $GLOBALS['nameFour'];
    $obj->start = $GLOBALS['start'];
    $obj->bounce = $GLOBALS['bounce'];
    $obj->gameOver = $GLOBALS['gameOver'];

    $obj->playerOneScore = $GLOBALS['playerOneScore'];
    $obj->playerTwoScore = $GLOBALS['playerTwoScore'];
    $obj->playerThreeScore = $GLOBALS['playerThreeScore'];
    $obj->playerFourScore = $GLOBALS['playerFourScore'];

    $obj->playerOneLive = $GLOBALS['playerOneLive'];
    $obj->playerTwoLive = $GLOBALS['playerTwoLive'];
    $obj->playerThreeLive = $GLOBALS['playerThreeLive'];
    $obj->playerFourLive = $GLOBALS['playerFourLive'];

    //$obj->msg = "$data";
    $obj->id = $id;
    $obj->num = $GLOBALS['num_cli'];
    $obj->time = "time is: $time";
    return json_encode($obj);
}

// SSL context.
$context = [
    'ssl' => [
        'local_cert' => '/home/xspurnay/ssl/webte_fei_stuba_sk.pem',
        'local_pk' => '/home/xspurnay/ssl/webte.fei.stuba.sk.key',
        'verify_peer' => false,
    ]
];

// Create A Worker and Listens 9000 port, use Websocket protocol
$ws_worker = new Worker("websocket://0.0.0.0:9000", $context);

// Enable SSL. WebSocket+SSL means that Secure WebSocket (wss://).
// The similar approaches for Https etc.
$ws_worker->transport = 'ssl';

// 4 processes
$ws_worker->count = 1;

// Add a Timer to Every worker process when the worker process start
$ws_worker->onWorkerStart = function ($ws_worker) {
//        $GLOBALS['userdata']=0;
//        $GLOBALS['num_cli']=0;
    // Timer every 5 seconds
    Timer::add(0.016, function () use ($ws_worker) {

        if (!$GLOBALS['playerOneLive'] && !$GLOBALS['playerTwoLive'] && !$GLOBALS['playerThreeLive'] && !$GLOBALS['playerFourLive']){
            $GLOBALS['gameOver'] = true;
        } else if ($GLOBALS['start']) {
            //Iterate over connections and send the time
            updateGame();
        }

        foreach ($ws_worker->connections as $connection) {
            $connection->send(generateRandomNumberJsonMessage($GLOBALS['userdata'], $connection->clientId));
            //$connection->send($GLOBALS['num_cli']);
            //echo $GLOBALS['userdata'];
        }


    });


    // Emitted when new connection come
    $ws_worker->onConnect = function ($connection) {
        $GLOBALS['userdata'] = 0;
        $GLOBALS['num_cli'] = $GLOBALS['num_cli'] + 1;
        $connection->clientId = $GLOBALS['num_cli'];


        // Emitted when websocket handshake done
        $connection->onWebSocketConnect = function ($connection) {
            if ($GLOBALS['num_cli'] == 4) $GLOBALS['start'] = true;
            $connection->send(generateRandomNumberJsonMessage($GLOBALS['userdata'], $connection->clientId));
            echo "New connection with ID " . $connection->clientId . "\n";
//            echo "speedX " . $GLOBALS['ballVelocityX'];
//            echo "speedY\n" . $GLOBALS['ballVelocityY'];
            if ($connection->clientId == 1) $GLOBALS['playerOneLive'] = true;
            if ($connection->clientId == 2) $GLOBALS['playerTwoLive'] = true;
            if ($connection->clientId == 3) $GLOBALS['playerThreeLive'] = true;
            if ($connection->clientId == 4) $GLOBALS['playerFourLive'] = true;
            $GLOBALS['gameOver'] = false;
        };
    };

    $ws_worker->onMessage = function ($connection, $json_string) {
        $GLOBALS['start'] = true;
        $data = json_decode($json_string);

        if ($connection->clientId == 1){
            $GLOBALS['paddleOneDirectionY'] = $data->paddleOneDirectionY;
            $GLOBALS['nameOne'] = $data->nameOne;
            //echo "Paddle " . $GLOBALS['paddleOneDirectionY'] . " from player " . $connection->clientId . "\n";
        }
        if ($connection->clientId == 2){
            $GLOBALS['paddleTwoDirectionY'] = $data->paddleOneDirectionY;
            $GLOBALS['nameTwo'] = $data->nameOne;
            //echo "Paddle " . $GLOBALS['paddleOneDirectionY'] . " from player " . $connection->clientId . "\n";
        }
        if ($connection->clientId == 3){
            $GLOBALS['paddleThreeDirectionX'] = $data->paddleOneDirectionY;
            $GLOBALS['nameThree'] = $data->nameOne;
            //echo "Paddle " . $GLOBALS['paddleOneDirectionY'] . " from player " . $connection->clientId . "\n";
        }
        if ($connection->clientId == 4){
            $GLOBALS['paddleFourDirectionX'] = $data->paddleOneDirectionY;
            $GLOBALS['nameFour'] = $data->nameOne;
            //echo "Paddle " . $GLOBALS['paddleOneDirectionY'] . " from player " . $connection->clientId . "\n";
        }

        //echo $data->paddleOneDirectionY;
        //$connection->send(generateRandomNumberJsonMessage($data, $connection->clientId));
        //echo "Paddle \n" . $GLOBALS['paddleOneDirectionY'];
    };

    // Emitted when connection closed
    $ws_worker->onClose = function ($connection) {
        echo "Connection closed with ID " . $connection->clientId . "\n";
        $GLOBALS['num_cli'] = $GLOBALS['num_cli'] - 1;
        if ($connection->clientId == 1) $GLOBALS['playerOneLive'] = false;
        if ($connection->clientId == 2) $GLOBALS['playerTwoLive'] = false;
        if ($connection->clientId == 3) $GLOBALS['playerThreeLive'] = false;
        if ($connection->clientId == 4) $GLOBALS['playerFourLive'] = false;
    };
};


////////////////////////////////////////////LOGIC//////////////////////////////////////////////////////////////////


//$ballPositionX = $ballPositionX + $ballVelocityX;

$playerOneZone = array(
    'x'=> 0,           //počiatočná x-súradnica
    'y'=> $canvas['height']/2 - 250,           //počiatočná y-súradnica
    'width'=> 20,      //šírka zóny
    'height'=> 500  //výška zóny (zhodná s výškou canvasu)
);
$playerTwoZone = array(
    'x'=> $canvas['width'] - 20,   //x-súradnica vpravo (šírka zóny = 10)
    'y'=> $canvas['height']/2 - 250,                  //počiatočná y-súradnica
    'width'=> 20,             //šírka zóny
    'height'=> 500 //výška zóny (zhodná s výškou canvasu)
);

$playerThreeZone = array(
    'x'=> $canvas['width']/2 - 250,           //počiatočná x-súradnica
    'y'=> 0,           //počiatočná y-súradnica
    'width'=> 500,      //šírka zóny
    'height'=> 20  //výška zóny (zhodná s výškou canvasu)
);
$playerFourZone = array(
    'x'=> $canvas['width']/2 - 250,           //počiatočná x-súradnica
    'y'=> $canvas['height'] - 20,           //počiatočná y-súradnica
    'width'=> 500,      //šírka zóny
    'height'=> 20  //výška zóny (zhodná s výškou canvasu)
);

//kontrola pre hráča 1
//kontrola pre hráča 1
/**
 * @return void
 */
function resetBall(): void
{
    $GLOBALS['ballVelocityX'] = -$GLOBALS['ballVelocityX'];
    //$GLOBALS['ballVelocityY'] = rand(-5, 5);
    $GLOBALS['ballPositionX'] = $GLOBALS['canvas']['width'] / 2;
    $GLOBALS['ballPositionY'] = $GLOBALS['canvas']['height'] / 2;
    $GLOBALS['ballVelocityX'] += 2;
}

function checkCollisionWithPlayerZone(): void
{
    if ($GLOBALS['playerOneLive']) {
        if ($GLOBALS['ballPositionX'] <= $GLOBALS['playerOneZone']['x'] + $GLOBALS['playerOneZone']['width'] &&
            $GLOBALS['ballPositionY'] >= $GLOBALS['playerOneZone']['y'] &&
            $GLOBALS['ballPositionY'] <= $GLOBALS['playerOneZone']['y'] + $GLOBALS['playerOneZone']['height']) {
            $GLOBALS['playerOneScore']--; //pridáme bod pre hráča 1
            if ($GLOBALS['playerOneScore'] == 0) $GLOBALS['playerOneLive'] = false;
            resetBall();
        }
    }
    //kontrola pre hráča 2
    if ($GLOBALS['playerTwoLive']) {
        if ($GLOBALS['ballPositionX'] >= $GLOBALS['playerTwoZone']['x'] &&
            $GLOBALS['ballPositionY'] >= $GLOBALS['playerTwoZone']['y'] &&
            $GLOBALS['ballPositionY'] <= $GLOBALS['playerTwoZone']['y'] + $GLOBALS['playerTwoZone']['height']) {
            $GLOBALS['playerTwoScore']--; //pridáme bod pre hráča 2
            if ($GLOBALS['playerTwoScore'] == 0) $GLOBALS['playerTwoLive'] = false;
            resetBall();
        }
    }
    // kontrola pre hráča 3
    if ($GLOBALS['playerThreeLive']) {
        if ($GLOBALS['ballPositionY'] <= $GLOBALS['playerThreeZone']['y'] + $GLOBALS['playerThreeZone']['height'] &&
            $GLOBALS['ballPositionX'] >= $GLOBALS['playerThreeZone']['x'] &&
            $GLOBALS['ballPositionX'] <= $GLOBALS['playerThreeZone']['x'] + $GLOBALS['playerThreeZone']['width']) {
            $GLOBALS['playerThreeScore']--; //pridáme bod pre hráča 3
            if ($GLOBALS['playerThreeScore'] == 0) $GLOBALS['playerThreeLive'] = false;
            resetBall();
        }
    }

        // kontrola pre hráča 4
    if ($GLOBALS['playerFourLive']) {
        if ($GLOBALS['ballPositionY'] >= $GLOBALS['playerFourZone']['y'] &&
            $GLOBALS['ballPositionX'] >= $GLOBALS['playerFourZone']['x'] &&
            $GLOBALS['ballPositionX'] <= $GLOBALS['playerFourZone']['x'] + $GLOBALS['playerFourZone']['width']) {
            $GLOBALS['playerFourScore']--; //pridáme bod pre hráča 4
            if ($GLOBALS['playerFourScore'] == 0) $GLOBALS['playerFourLive'] = false;
            resetBall();
        }
    }
}



function updateGame(): void
{

    $GLOBALS['ballPositionX'] = $GLOBALS['ballPositionX'] + $GLOBALS['ballVelocityX'];
    //$ballPositionX = $ballPositionX + $ballVelocityX;

    checkCollisionWithPlayerZone();

    //check player one
    if ($GLOBALS['playerOneLive'])
    if ($GLOBALS['ballPositionX'] < $GLOBALS['paddleWidth'] * 2 + $GLOBALS['ballSize'] / 2 + $GLOBALS['wallSize']) {
        if ($GLOBALS['ballPositionY'] >= $GLOBALS['paddleOneY'] && $GLOBALS['ballPositionY'] <= $GLOBALS['paddleOneY'] + $GLOBALS['paddleHeight'] && $GLOBALS['ballPositionX'] > $GLOBALS['paddleWidth'] + $GLOBALS['ballSize'] / 2) {
            $GLOBALS['ballVelocityX'] = -$GLOBALS['ballVelocityX'];
            $GLOBALS['ballVelocityY'] = rand(-3, 3);
            $GLOBALS['bounce']++;
        }
    }
    // check player two side
    if ($GLOBALS['playerTwoLive']) {
        if ($GLOBALS['ballPositionX'] > $GLOBALS['canvas']['width'] - $GLOBALS['paddleWidth'] * 2 - $GLOBALS['ballSize'] / 2 - $GLOBALS['wallSize']) {
            if ($GLOBALS['ballPositionY'] >= $GLOBALS['paddleTwoY'] && $GLOBALS['ballPositionY'] <= $GLOBALS['paddleTwoY'] + $GLOBALS['paddleHeight'] && $GLOBALS['ballPositionX'] < $GLOBALS['canvas']['width'] - $GLOBALS['paddleWidth']) {
                $GLOBALS['ballVelocityX'] = -$GLOBALS['ballVelocityX'];
                $GLOBALS['ballVelocityY'] = rand(-3, 3);
                $GLOBALS['bounce']++;
            }

        }
    }

    // check player three side (horný paddle)
    if ($GLOBALS['playerThreeLive']) {
        if ($GLOBALS['ballPositionY'] < $GLOBALS['paddleWidth'] * 2 + $GLOBALS['ballSize'] / 2 + $GLOBALS['wallSize']) {
            if ($GLOBALS['ballPositionX'] >= $GLOBALS['paddleThreeX'] && $GLOBALS['ballPositionX'] <= $GLOBALS['paddleThreeX'] + $GLOBALS['paddleHeight'] && $GLOBALS['ballPositionY'] > $GLOBALS['paddleWidth'] + $GLOBALS['ballSize'] / 2) {
                $GLOBALS['ballVelocityY'] = -$GLOBALS['ballVelocityY'];
                //$GLOBALS['ballVelocityX'] = rand(-3, 3);
                $GLOBALS['bounce']++;
            }
        }
    }
    // check player four side (dolný paddle)
    if ($GLOBALS['playerFourLive']) {
        if ($GLOBALS['ballPositionY'] > $GLOBALS['canvas']['height'] - $GLOBALS['paddleWidth'] * 2 - $GLOBALS['ballSize'] / 2 - $GLOBALS['wallSize']) {
            if ($GLOBALS['ballPositionX'] >= $GLOBALS['paddleFourX'] && $GLOBALS['ballPositionX'] <= $GLOBALS['paddleFourX'] + $GLOBALS['paddleHeight'] && $GLOBALS['ballPositionY'] < $GLOBALS['canvas']['height'] - $GLOBALS['paddleWidth'] - $GLOBALS['ballSize'] / 2) {
                $GLOBALS['ballVelocityY'] = -$GLOBALS['ballVelocityY'];
                //$GLOBALS['ballVelocityX'] = rand(-3, 3);
                $GLOBALS['bounce']++;
            }
        }
    }


// check left and right wall
    if ($GLOBALS['ballPositionX'] > $GLOBALS['canvas']['width'] - $GLOBALS['ballSize'] / 2 - $GLOBALS['wallSize']) {
        $GLOBALS['ballVelocityX'] = -$GLOBALS['ballVelocityX'];
        $GLOBALS['ballPositionX'] = $GLOBALS['canvas']['width'] - $GLOBALS['ballSize'] / 2 - $GLOBALS['wallSize'];
        $GLOBALS['bounce']++;
    } else if ($GLOBALS['ballPositionX'] < $GLOBALS['ballSize'] / 2 + $GLOBALS['wallSize']) {
        $GLOBALS['ballVelocityX'] = -$GLOBALS['ballVelocityX'];
        $GLOBALS['ballPositionX'] = $GLOBALS['ballSize'] / 2 + $GLOBALS['wallSize'];
        $GLOBALS['bounce']++;
    }
    // check up and down wall
    $GLOBALS['ballPositionY'] = $GLOBALS['ballPositionY'] + $GLOBALS['ballVelocityY'];
    if ($GLOBALS['ballPositionY'] > $GLOBALS['canvas']['height'] - $GLOBALS['ballSize'] / 2 - $GLOBALS['wallSize']) {
        $GLOBALS['ballVelocityY'] = -$GLOBALS['ballVelocityY'];
        $GLOBALS['ballPositionY'] = $GLOBALS['canvas']['height'] - $GLOBALS['ballSize'] / 2 - $GLOBALS['wallSize'];
        $GLOBALS['bounce']++;
    } else if ($GLOBALS['ballPositionY'] < $GLOBALS['ballSize'] / 2 + $GLOBALS['wallSize']) {
        $GLOBALS['ballVelocityY'] = -$GLOBALS['ballVelocityY'];
        $GLOBALS['ballPositionY'] = $GLOBALS['ballSize'] / 2 + $GLOBALS['wallSize'];
        $GLOBALS['bounce']++;
    }

// move paddle one
    if ($GLOBALS['paddleOneDirectionY'] === 'up' && $GLOBALS['paddleOneY'] >= 0) {
        $GLOBALS['paddleOneY'] = $GLOBALS['paddleOneY'] - $GLOBALS['paddleOneVelocityY'];
    } else if ($GLOBALS['paddleOneDirectionY'] === 'down' && $GLOBALS['paddleOneY'] < ($GLOBALS['canvas']['height'] - $GLOBALS['paddleHeight'] - $GLOBALS['wallSize'])) {
        $GLOBALS['paddleOneY'] += $GLOBALS['paddleOneVelocityY'];
    }
// move paddle two
    if ($GLOBALS['paddleTwoDirectionY'] === 'up' && $GLOBALS['paddleTwoY'] >= 0) {
        $GLOBALS['paddleTwoY'] = $GLOBALS['paddleTwoY'] - $GLOBALS['paddleTwoVelocityY'];
    } else if ($GLOBALS['paddleTwoDirectionY'] === 'down' && $GLOBALS['paddleTwoY'] < ($GLOBALS['canvas']['height'] - $GLOBALS['paddleHeight'] - $GLOBALS['wallSize'])) {
        $GLOBALS['paddleTwoY'] += $GLOBALS['paddleTwoVelocityY'];
    }
    // move paddle three
    if ($GLOBALS['paddleThreeDirectionX'] === 'up' && $GLOBALS['paddleThreeX'] >= 0) {
        $GLOBALS['paddleThreeX'] = $GLOBALS['paddleThreeX'] - $GLOBALS['paddleThreeVelocityX'];
    } else if ($GLOBALS['paddleThreeDirectionX'] === 'down' && $GLOBALS['paddleThreeX'] < ($GLOBALS['canvas']['width'] - $GLOBALS['paddleHeight'] - $GLOBALS['wallSize'])) {
        $GLOBALS['paddleThreeX'] += $GLOBALS['paddleThreeVelocityX'];
    }
    //move paddle four
    if ($GLOBALS['paddleFourDirectionX'] === 'up' && $GLOBALS['paddleFourX'] >= 0) {
        $GLOBALS['paddleFourX'] = $GLOBALS['paddleFourX'] - $GLOBALS['paddleFourVelocityX'];
    } else if ($GLOBALS['paddleFourDirectionX'] === 'down' && $GLOBALS['paddleFourX'] < ($GLOBALS['canvas']['width'] - $GLOBALS['paddleHeight'] - $GLOBALS['wallSize'])) {
        $GLOBALS['paddleFourX'] += $GLOBALS['paddleFourVelocityX'];
    }
    /*
// check player two side
    if ($ballPositionX > $canvas['width'] - $paddleWidth * 2 - $ballSize / 2 - $wallSize) {
        if ($ballPositionY >= $paddleTwoY && $ballPositionY <= $paddleTwoY + $paddleHeight && $ballPositionX < $canvas['width'] - $paddleWidth) {
            $ballVelocityX = -$ballVelocityX;
            $ballVelocityY = rand(-3, 3);
        }
    } else if ($ballPositionX < $paddleWidth * 2 + $ballSize / 2 + $wallSize) {
        if ($ballPositionY >= $paddleOneY && $ballPositionY <= $paddleOneY + $paddleHeight && $ballPositionX > $paddleWidth + $ballSize / 2) {
            $ballVelocityX = -$ballVelocityX;
            $ballVelocityY = rand(-3, 3);
        }
    }
    // check left and right wall
    if ($ballPositionX > $canvas['width'] - $ballSize / 2 - $wallSize) {
        $ballVelocityX = -$ballVelocityX;
        $ballPositionX = $canvas['width'] - $ballSize / 2 - $wallSize;
    } else if ($ballPositionX < $ballSize / 2 + $wallSize) {
        $ballVelocityX = -$ballVelocityX;
        $ballPositionX = $ballSize / 2 + $wallSize;
    }
    // check up and down wall
    $ballPositionY = $ballPositionY + $ballVelocityY;
    if ($ballPositionY > $canvas['height'] - $ballSize / 2 - $wallSize) {
        $ballVelocityY = -$ballVelocityY;
        $ballPositionY = $canvas['height'] - $ballSize / 2 - $wallSize;
    } else if ($ballPositionY < $ballSize / 2 + $wallSize) {
        $ballVelocityY = -$ballVelocityY;
        $ballPositionY = $ballSize / 2 + $wallSize;
    }

    // move paddle one
    if ($paddleOneDirectionY === 'up' && $paddleOneY >= 0) {
        $paddleOneY = $paddleOneY - $paddleOneVelocityY;
    } else if ($paddleOneDirectionY === 'down' && $paddleOneY < ($canvas['height'] - $paddleHeight - $wallSize)) {
        $paddleOneY += $paddleOneVelocityY;
    }
    // move paddle two
    if ($paddleTwoDirectionY === 'up' && $paddleTwoY >= 0) {
        $paddleTwoY = $paddleTwoY - $paddleTwoVelocityY;
    } else if ($paddleTwoDirectionY === 'down' && $paddleTwoY < ($canvas['height'] - $paddleHeight - $wallSize)) {
        $paddleTwoY += $paddleTwoVelocityY;
    }
    */
}
// Run worker
Worker::runAll();
?>
