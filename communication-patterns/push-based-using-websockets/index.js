const http = require('node:http');
const ws = require('websocket');

const WebSocketServer = ws.server;
const HttpServer = http.createServer();

const connections = [];

const websocket = new WebSocketServer({httpServer: HttpServer});
HttpServer.listen(8080, () => console.log(`Server started & listening on port 8080`));

websocket.on('request', (request) => {
    const connection = request.accept(null, request.origin);

    // push/broadcast messages to all users
    connection.on('message', (message) => {
        connections.forEach((conn) => conn.send(`User >> ${connection.socket.remotePort} message >> ${message.utf8Data}`));
    });

    connections.forEach((conn) => conn.send(`User >> ${connection.socket.remotePort} connected`));

    connections.push(connection);
});


//client code
//const ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = (message) => console.log(`Received: ${message.data}`);
//ws.send("Hello! I'm client")