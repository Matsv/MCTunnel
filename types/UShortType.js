let Type = require('./Type');

class UShortType extends Type {

    constructor() {
        super("ushort");
    }

    read(buffer, offset) {
        return {
            value: buffer.readUInt16BE(offset),
            size: 2
        };
    }

    write(buffer, offset, value) {
        buffer.writeUInt16BE(value, offset);
        return offset + 2;
    }

    size(value) {
        return 2;
    }
}
module.exports = UShortType;