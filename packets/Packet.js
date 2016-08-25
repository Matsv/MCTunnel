let PacketBuffer = require('./PacketBuffer');

class Packet {

    constructor(id) {
        this._id = id;
        this.types = [];
    }

    get getId() {
        return this._id;
    }

    read(buffer) {
        throw "No read given for " + this._id;
    }

    write(buffer) {
        console.log("No write given");
    }

    handle() {
        console.log("No handle given");
    }
    
    send(client){
        let buff = new PacketBuffer();
        buff.setPacketId = this._id;
        this.write(buff);
        buff.send(client);
    }
    
    getBuffer(){
        let buff = new PacketBuffer();
        buff.setPacketId = this._id;
        this.write(buff);
        return buff.finish();
    }
}

module.exports = Packet;