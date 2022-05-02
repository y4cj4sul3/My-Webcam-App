function connect() {
    var ws = new WebSocket(location.origin.replace(/^http/, "ws"));
    ws.onmessage = function (e) {
        const cmd = e.data.charAt(0);
        if (cmd === "n") {
            // load lastest images
            imagelist.loadLatest();
        } else if (cmd === "d") {
            // delete image
            imagelist.deleteImageFromList(e.data.substring(1));
        }
    };
    ws.onopen = function (e) {
        console.log("Socket is connected");
        // load lastest images
        imagelist.loadLatest();
    };
    ws.onclose = function (e) {
        // try reconnect
        console.log(
            "Socket is closed. Reconnect will be attempted in 5 second.",
            e.code
        );
        setTimeout(function () {
            connect();
        }, 5000);
    };
    ws.onerror = function (err) {
        console.error("Socket encountered error, closing socket.");
        ws.close();
    };
}
