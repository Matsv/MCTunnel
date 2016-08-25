class TypeRegistry {

    static registerType(name, claz){
        TypeRegistry.types[name] = claz;
    }

    static getType(name){
        return TypeRegistry.types[name];
    }

    static registerTypes() { //TODO uhl please make this less ugly, I'm about to puke
        let byte = new require("./ByteType");
        let long = new require("./LongType");
        let short = new require("./ShortType");
        let string = new require("./StringType");
        let ubyte = new require("./UByteType");
        let ushort = new require("./UShortType");
        let varint = new require("./VarIntType");
        new byte();
        new long();
        new short();
        new string();
        new ubyte();
        new ushort();
        new varint();
    };
}

TypeRegistry.types = [];

module.exports = TypeRegistry;