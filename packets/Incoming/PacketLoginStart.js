var Packet = require('./../Packet');

class PacketLoginStart extends Packet {

    constructor(name = "null") {
        super(0x00);
        this.name = name;
    }

    read(buffer) {
        this.name = buffer.read("string");
    }

    write(buffer) {
        buffer.write("string", this.name);
    }

    handle(client) {
        client.setUsername = this.name;
        client.connect(client);
    }
}

module.exports = PacketLoginStart;