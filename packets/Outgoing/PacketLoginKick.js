var Packet = require('./../Packet');

class PacketLoginKick extends Packet {

    constructor(reason = {text:"No reason given"}) {
        super(0x00);
        this.reason = reason;
    }

    read(buffer) {
        this.reason = JSON.parse(buffer.read("string"));
    }

    write(buffer) {
        buffer.write("string", JSON.stringify(this.reason));
    }

    handle(client) {

    }
}

module.exports = PacketLoginKick;