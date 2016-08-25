var Packet = require('./../Packet');

class PacketStatusResponse extends Packet {

    constructor(json = {}) {
        super(0x00);
        this.status = json;
    }

    read(buffer) {
        this.status = JSON.parse(buffer.read("string"));
    }

    write(buffer) {
        buffer.write("string", JSON.stringify(this.status));
    }

    handle(client) {
    }
}

module.exports = PacketStatusResponse;