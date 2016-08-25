let Type = require('./Type');
let TypeRegistry = require('./TypeRegistry');
let assert = require("assert");
let STRING_MAX = 32767;

class StringType extends Type {

    constructor() {
        super("string");
    }

    read(buffer, offset) {
        let length = TypeRegistry.getType("varint").read(buffer, offset);
        assert.ok(length.value < STRING_MAX, "Cannot receive string longer than " + STRING_MAX);

        let part = offset + length.size;
        let strEnd = part + length.value;

        assert.ok(strEnd <= buffer.length, "String is longer than the buffer size, people are faking it");
        let value = buffer.toString('utf8', part, strEnd);

        return {
            value: value,
            size: strEnd - offset
        };
    }

    write(buffer, offset, value) {
        let length = Buffer.byteLength(value, 'utf8');
        assert.ok(length < STRING_MAX, "Cannot write string longer than " + STRING_MAX);
        
        offset = TypeRegistry.getType("varint").write(buffer, offset, length);
        buffer.write(value, offset, length, 'utf8');
        return offset + length;
    }

    size(value) {
        var length = Buffer.byteLength(value, 'utf8');
        assert.ok(length < STRING_MAX, "String cannot be longer than " + STRING_MAX);
        return TypeRegistry.getType("varint").size(length) + length;
    }
}

module.exports = StringType;