var config = require("./config.json");

var net = require('net');
var server = net.createServer();
var Client = require("./Client");

var TypeRegistry = require("./types/TypeRegistry");
var packetManager = require("./packets/PacketManager");

TypeRegistry.registerTypes();
packetManager.registerPackets();

var connections = [];

server.on("connection", function (socket) {
    console.log("New incoming connection: " + socket.remoteAddress);
    let client = new Client(socket);
    connections[socket] = client;
    
    let address = JSON.stringify(socket.remoteAddress);
    socket.on('data', function (buffer) {
        if (client._proxy)
            return;
        if (buffer.length !== 0) {
            try {
                client.handle(buffer);
            } catch (e) {
                console.log(e);
                console.log(address + " sent a wrong packet. Disconnecting");
                socket.destroy();
            }
        }
    });

    socket.on('error', function (err) {
        console.log(err);
    });

    socket.on('close', function (err) {
        console.log("Connection closed (" + address + ") err: " + err);
        client.close();
        client._connected = false;
        delete connections[socket];
    });
    
    socket.on('end', function (err) {
       client._connected = false; 
    });

});

server.on('listening', function () {
    console.log("Listening on port " + config.listenPort)
});

server.on('error', function (data) {
    console.log("Error while starting server: " + data);
});

server.listen(config.listenPort, config.listenIp);