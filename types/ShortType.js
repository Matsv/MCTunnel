let Type = require('./Type');

class ShortType extends Type {

    constructor() {
        super("short");
    }

    read(buffer, offset) {
        return {
            value: buffer.readInt16BE(offset),
            size: 2
        };
    }

    write(buffer, offset, value) {
        buffer.writeInt16BE(value, offset);
        return offset + 2;
    }

    size(value) {
        return 2;
    }
}

module.exports = ShortType;