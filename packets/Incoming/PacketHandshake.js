var states = require('./../../state');
var Packet = require('./../Packet');

class PacketHandshake extends Packet {

    constructor(protVersion = -1, host = "notset", port = -1, nextState = -1) {
        super(0x00);
        this._protocolVersion = protVersion;
        this.host = host;
        this.port = port;
        this.nextState = nextState;
    }

    read(buffer) {
        this._protocolVersion = buffer.read("varint");
        this.host = buffer.read("string");
        this.port = buffer.read("ushort");
        this.nextState = buffer.read("varint");
    }

    write(buffer) {
        buffer.write("varint", this._protocolVersion);
        buffer.write("string", this.host);
        buffer.write("ushort", this.port);
        buffer.write("varint", this.nextState);
    }

    handle(client) {
        client.setProtocol = this._protocolVersion;
        client.setState = states[this.nextState];
        client.setHost = this.host;
    }
}

module.exports = PacketHandshake;