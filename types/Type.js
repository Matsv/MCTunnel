var TypeRegistry = require("./TypeRegistry");

class Type {

    constructor(name) {
        this.name = name;
        if (typeof TypeRegistry.types === 'undefined')
            TypeRegistry.registerTypes();
        TypeRegistry.registerType(name, this);
    }

    read(buffer, offset){
        throw "No read found";
    }

    write(buffer, offset, value){
        throw "No write found";
    }

    size(value){
        throw "No size found";
    }
}

module.exports = Type;