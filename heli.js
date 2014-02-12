drone = require('ar-drone');

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var aspeed = 16.5;
var connection;
var client  = drone.createClient();
var rotation, sRotation, eRotation, readings = [];
client.on('navdata', function(data){ if (typeof data.demo !== 'undefined') rotation = data.demo.rotation; readings.push(rotation) });

wsServer.on('request', function(request) {
    connection = request.accept('', request.origin);
	//client.createRepl();
	//client.takeoff();

	client
		.after(1000, function() {
			var pngStream = client.getPngStream(); 
			pngStream.on('data', function onPngData(pngdata) {
				connection.sendBytes(pngdata);
			});
			this.takeoff();
			this.clockwise(0.3);
			sRotation = rotation;
			console.log(rotation);
		})
		.after((360/aspeed), function(){
			this.stop();
			this.land();
			eRotation = rotation
			console.log(rotation);
			console.log(eRotation.clockwise - sRotation.clockwise);
		})
		after((Math.min.apply(readings)));
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
            try {
            	var json = JSON.parse(message.utf8Data);
            	// switch (json.msg) {

            	// }
            	
            }
            catch (ex) {
            	console.log("damn "+ex);
            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});