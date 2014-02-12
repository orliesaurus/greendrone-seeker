drone = require('ar-drone');
var client  = drone.createClient();
//client.createRepl();
//client.takeoff();



client
	.after(5000, function() {
		var pngStream = client.getPngStream(); 
		pngStream.on('data', function onPngData(pngdata) {
			console.log(pngdata);
		});
	})
	.after(5000, function(){
		//this.land();
	});