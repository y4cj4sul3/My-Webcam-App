const { Server } = require("ws");

var wws = {
    init: function (httpserver) {
        this.server = new Server({ server: httpserver });

        this.server.on("connection", (ws) => {
            console.log("Client Connected");
            ws.on("close", () => console.log("Client disconnected"));
        });

        console.log("Websocket initialized");
    },

    boardcast: function (message) {
        if (this.server) {
            this.server.clients.forEach((client) => {
                client.send(message);
            });
            console.log("boardcasted: " + message);
        } else {
            console.log("Websocket not initialized");
        }
    },
};

module.exports = wws;
