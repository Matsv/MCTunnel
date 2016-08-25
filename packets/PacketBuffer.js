var types = require("../types/Type");
var TypeRegistry = require("../types/TypeRegistry");

class PacketBuffer {

    constructor(buffer, offset = 0) {
        this.packetId = -1;
        this.buffer = buffer;
        this.types = [];
        this.offset = offset;
    }

    init() {
        if (typeof this.buffer === 'undefined')
            throw "Buffer is empty, failed to init";
        this.length = this.read("varint");
        this.packetId = this.read("varint");
    }

    write(type, value) {
        if (typeof TypeRegistry.getType(type) === 'undefined')
            throw "No type " + type + " found to write for packet id " + this.packetId + " and value " + value;
        this.types[this.types.length] = {type: type, value: value};
    }

    read(type) {
        let handler = TypeRegistry.getType(type);
        if (typeof handler === 'undefined')
            throw "No type " + type + " found to read for packet id " + this.packetId;

        let result = handler.read(this.buffer, this.offset);
        this.offset += result.size;
        if (this.offset > this.buffer.length)
            throw "Offset is more than the buffer length";
        return result.value;
    }

    set setPacketId(value) {
        this.packetId = value;
    }

    get getPacketId() {
        return this.packetId;
    }

    send(client) {
        client.send(this.finish())
    }

    finish() {
        let size = 0;
        let varint = TypeRegistry.getType("varint");
        
        size += varint.size(this.getPacketId);
        for (let i = 0; i < this.types.length; i++) {
            let type = this.types[i];
            let handle = TypeRegistry.getType(type.type);
            size += handle.size(type.value);
        }

        this.offset = 0;
        var buffer = new Buffer(size + varint.size(size));
        this.offset = varint.write(buffer, this.offset, size);
        this.offset = varint.write(buffer, this.offset, this.packetId);

        for (let x = 0; x < this.types.length; x++) {
            let typie = this.types[x];
            let handler = TypeRegistry.getType(typie.type);
            this.offset = handler.write(buffer, this.offset, typie.value);
        }

        return buffer;
    }

}

module.exports = PacketBuffer;