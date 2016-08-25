var Type = require("./Type");
var assert = require('assert');

class VarIntType extends Type {
    constructor() {
        super("varint");
    }

    read(buffer, offset) {
        var result = 0;
        var shift = 0;
        var cursor = offset;

        while (true) {
            if (cursor + 1 > buffer.length)
                throw "Cursor is bigger than the buffer length";
            var b = buffer.readUInt8(cursor);
            result |= ((b & 0x7f) << shift); // Add the bits to our number, except MSB
            cursor++;
            if (!(b & 0x80)) { // If the MSB is not set, we return the number
                return {
                    value: result,
                    size: cursor - offset
                };
            }
            shift += 7; // we only have 7 bits, MSB being the return-trigger
            assert.ok(shift < 64, "varint is too big"); // Make sure our shift don't overflow.
        }
    }

    write(buffer, offset, value) {
        var cursor = 0;
        while (value & ~0x7F) {
            buffer.writeUInt8((value & 0xFF) | 0x80, offset + cursor);
            cursor++;
            value >>>= 7;
        }
        buffer.writeUInt8(value, offset + cursor);
        return offset + cursor + 1;
    }

    size(value) {
        let cursor = 0;
        while (value & ~0x7F) {
            value >>>= 7;
            cursor++;
        }
        return cursor + 1;
    }
}
module.exports = VarIntType;