let Type = require('./Type');

class ByteType extends Type {

    constructor() {
        super("byte");
    }

    read(buffer, offset) {
        return {
            value: buffer.readInt8(offset),
            size: 1
        };
    }

    write(buffer, offset, value) {
        buffer.writeInt8(value, offset);
        return offset + 1;
    }

    size(value) {
        return 1;
    }
}

module.exports = ByteType;