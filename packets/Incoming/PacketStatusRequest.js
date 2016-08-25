var Packet = require('./../Packet');
var StatusResponse = require('./../Outgoing/PacketStatusResponse');

class PacketHandshake extends Packet {

    constructor() {
        super(0x00);
    }

    read(buffer) {
    }

    write(buffer) {
    }

    handle(client) {
        var response = {
            "version": {
                "name": "Super fancy name",
                "protocol": client.getProtocol
            },
            "players": {
                "max": 100,
                "online": 0,
                "sample": []
            },
            "description": {
                "text": "Hello world"
            },
            "favicon": "data:image/png;base64,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"
        };
        // let pack = new StatusResponse(response);
        // pack.send(client);
        client.connect(client);
    }
}

module.exports = PacketHandshake;