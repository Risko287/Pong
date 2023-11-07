<?php
//php server2.php start
    use Workerman\Worker;
    use Workerman\Lib\Timer;
    require_once 'vendor/workerman/workerman/Autoloader.php';
 
    function generateRandomNumberJsonMessage($data, $id) {
		$time = date('h:i:s');
		$num = $GLOBALS['num_cli'];
        $msg = $GLOBALS['userdata'];
		 
		$obj = new stdClass();
		$obj->msg = "$data";
		$obj->id = "$id";
		$obj->num = "$num";
		$obj->time = "time is: $time";
		return json_encode($obj);
	}

    // SSL context.
    $context = [
        'ssl' => [
            'local_cert'  => '/home/xspurnay/ssl/webte_fei_stuba_sk.pem',
            'local_pk'    => '/home/xspurnay/ssl/webte.fei.stuba.sk.key',
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
    $ws_worker->onWorkerStart = function($ws_worker)
    {
//        $GLOBALS['userdata']=0;
//        $GLOBALS['num_cli']=0;
        // Timer every 5 seconds
        Timer::add(0.016, function()use($ws_worker)
        {
           //Iterate over connections and send the time
          foreach($ws_worker->connections as $connection)
            {
                $connection->send(generateRandomNumberJsonMessage($GLOBALS['userdata'], $connection->clientId));
                //$connection->send($GLOBALS['num_cli']);
                //echo $GLOBALS['userdata'];
            }
        });
    
 
    // Emitted when new connection come
    $ws_worker->onConnect = function($connection)
    {
        $GLOBALS['userdata']= 0;
        $GLOBALS['num_cli'] = $GLOBALS['num_cli'] + 1;
        $connection->clientId = $GLOBALS['num_cli'];
        // Emitted when websocket handshake done
        $connection->onWebSocketConnect = function($connection)
        {
            echo "New connection\n" . $connection->clientId;
        };
    };
 
    $ws_worker->onMessage = function($connection, $data)
    {
        $GLOBALS['userdata']=$data;
        // Send hello $data
        $connection->send(generateRandomNumberJsonMessage($data, $connection->clientId));
        //echo "DATA \n" . $GLOBALS['userdata'];
    };
 
    // Emitted when connection closed
    $ws_worker->onClose = function($connection)
    {
        echo "Connection closed";
        $GLOBALS['num_cli'] = $GLOBALS['num_cli'] - 1;
    };
}; 
    // Run worker
    Worker::runAll();
    
    
?>
    