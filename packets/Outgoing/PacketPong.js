var Packet = require('./../Packet');

class PacketPong extends Packet {

    constructor(pong = -1) {
        super(0x01);
        this.pong = pong;
    }

    read(buffer) {
        this.pong = buffer.read("long");
    }
    
    write(buffer) {
        buffer.write("long",this.pong)
    }

    handle(client) {
        
    }
}

module.exports = PacketPong;