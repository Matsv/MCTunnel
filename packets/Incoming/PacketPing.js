var Packet = require('./../Packet');
var PongPacket = require('./../Outgoing/PacketPong');

class PacketPing extends Packet {

    constructor(payload = -1) {
        super(0x01);
        this.payload = payload;
    }

    read(buffer) {
        this.payload = buffer.read("long");
    }

    write(buffer) {
        buffer.write("long", this.payload);
    }

    handle(client) {
        this.pong = new PongPacket(this.payload);
        this.pong.send(client);
    }
}

module.exports = PacketPing;