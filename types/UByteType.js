let Type = require('./Type');

class UByteType extends Type {

    constructor() {
        super("ubyte");
    }

    read(buffer, offset) {
        return {
            value: buffer.readUInt8(offset),
            size: 1
        };
    }

    write(buffer, offset, value) {
        buffer.writeUInt8(value, offset);
        return offset + 1;
    }

    size(value) {
        return super.size(value);
    }
}

module.exports = UByteType;