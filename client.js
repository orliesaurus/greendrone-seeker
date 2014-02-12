window.addEventListener("load", function(){

    var socket = new WebSocket("ws://localhost:8080");
    socket.binaryType = "arraybuffer";

    socket.onopen = function() {
        // socket.send(JSON.stringify({ msg: "challenge_accepted", name: "DaQuirm" }));
    };

    socket.onmessage = function(evt) {
        if (typeof evt.data == "string") {
            var msg = JSON.parse(evt.data);
            switch (msg.msg) {
                case "auth":
                    break;
            }
        } else {
            var blob = new Blob([evt.data], {type: 'image/png'});
            var url = URL.createObjectURL(blob);
            var img = new Image;

            img.onload = function() {
                var context = document.getElementById("video").getContext('2d');
                context.drawImage(this, 0, 0);
                URL.revokeObjectURL(url);
                var pixelInterval = 5;
                var rgb = { r:0, g:0, b:0 };
                try {
                    data = context.getImageData(0, 135, this.width, 90);
                } catch(e) {
                    alert(e);
                    return rgb;
                }

                var data = data.data;
                var length = data.length;
                var i = 0;
                var count = 0;
                while ((i += pixelInterval * 4) < length) {
                    count++;
                    rgb.r += data[i];
                    rgb.g += data[i+1];
                    rgb.b += data[i+2];
                }

                rgb.r = Math.floor(rgb.r/count);
                rgb.g = Math.floor(rgb.g/count);
                rgb.b = Math.floor(rgb.b/count);
                // #75db1b
                var distance = (Math.sqrt(
                    Math.pow(0x75 - rgb.r,2) + Math.pow(0xdb - rgb.g,2) + Math.pow(0x1b - rgb.b,2)
                ));
                console.log(distance);
                socket.send(JSON.stringify({ msg:'distance', distance: distance }));
                document.querySelector("#color-distance").textContent = distance;
            }
            img.src = url;
        }
    }

});

