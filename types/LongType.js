let Type = require('./Type');
let assert = require('assert');
let LONG_BYTES = 8;

class LongType extends Type {

    constructor() {
        super("long");
    }

    read(buffer, offset) {
        assert.ok(offset + LONG_BYTES <= buffer.length, "Cannot read long, not enough bytes inside the buffer");
        return {
            value: [buffer.readInt32BE(offset), buffer.readInt32BE(offset + 4)], //TODO MAYBE INT
            size: 8
        };
    }

    write(buffer, offset, value) {
        buffer.writeInt32BE(value[0], offset);
        buffer.writeInt32BE(value[1], offset + 4); //TODO MAYBE INT
        return offset + LONG_BYTES;
    }

    size(value) {
        return LONG_BYTES;
    }
}

module.exports = LongType;