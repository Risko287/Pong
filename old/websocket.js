var ws = new WebSocket("wss://site227.webte.fei.stuba.sk:9000");
var id;
$(document).ready(function () {
    ws.onopen = function () { log("Connection established");
        //var canvas = document.getElementById('gameCanvas');
        sendData(0, 250, 250, canvas.width/2, canvas.height/2 );
    };
    ws.onerror = function (error) { log("Unknown WebSocket Error " + JSON.stringify(error)); };
    ws.onmessage = function (e) {  var data = JSON.parse(e.data);
        //console.log(data);
        id = data.id;
        var parsed = JSON.parse(data.msg);
        console.log(parsed);
        //changeEverything(parsed);
        //log("< " + data.time);
        //document.getElementById("number").innerHTML = data.num + "<br>";
        //document.getElementById("prd").innerHTML = data.msg + "<br>";
    };
    ws.onclose = function () { log("Connection closed - Either the host or the client has lost connection"); }

    function log(m) {
        $("#log").append(m + "<br />");
    }

    $("#send").click(send);
    $("#msg").on("keydown", function (event) {
        if (event.keyCode == 13) send();
    });
    $("#quit").click(function () {
        log("Connection closed");
        ws.close(); ws = null;
    });
});

// ws.addEventListener("open", (event) => {
//     console.log("Pripojený na server");
// });
//
// // funkcia, ktorá sa zavolá po prijatí dát zo servera
// ws.addEventListener("message", (event) => {
//     const data = JSON.parse(event.data); // dáta sú poslané vo formáte JSON, tak ich musíme dekódovať
//     console.log("Prijaté dáta zo servera:", data);
//     console.log("skore: ", data.msg);
//
//     // tu môžete aktualizovať vizuálne zobrazenie hry na základe prijatých dát
// });

function send() {
    $Msg = $("#msg");
    if ($Msg.val() == "") return alert("Textarea is empty");

    try {
        ws.send($Msg.val()); log('> Sent to server:' + $Msg.val());
    } catch (exception) {
        log(exception);
    }
    $Msg.val("");
}

function sendData(playerScore, paddleOneY, paddleTwoY, ballX, ballY) {
    try {
        // zakódovanie dát do formátu JSON
        const data = JSON.stringify({ score: playerScore, paddleOneY: paddleOneY, paddleTwoY: paddleTwoY, ballX: ballX, ballY: ballY });

        // odoslanie dát na server
        ws.send(data);
        //ws.send(playerScore);

        //console.log('> Odoslané na server: ' + data);
    } catch (exception) {
        console.log(exception);
    }
}
function sendDataP2(playerScore, paddleTwoY) {
    try {
        // zakódovanie dát do formátu JSON
        const data = JSON.stringify({ score: playerScore, paddleTwoY: paddleTwoY});

        // odoslanie dát na server
        ws.send(data);
        //ws.send(playerScore);

        //console.log('> Odoslané na server: ' + data);
    } catch (exception) {
        console.log(exception);
    }
}