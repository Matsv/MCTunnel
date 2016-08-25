var HashMap = require("../HashMap");

class PacketManager {
    static registerPacket(id, direction, state, claz) {
        let name = this.getString(id, direction, state);
        PacketManager.packets.put(name, claz);
    }

    static getString(id, direction, state) {
        return id + "_" + direction + "_" + state;
    }

    static getPacket(id, direction, state) {
        let packet = PacketManager.packets.get(this.getString(id, direction, state));
        if (typeof packet === 'undefined')
            throw "Packet " + id + " not found for state " + state;
        return new packet();
    }

    static getPacketFromBuffer(state, direction, buffer) {
        let packetId = buffer.getPacketId;
        let packet = PacketManager.getPacket(packetId, direction, state);
        packet.read(buffer);
        return {
            packet: packet,
            remainingBytes: buffer.buffer.length - buffer.offset,
            offset: buffer.offset,
            length: buffer.buffer.length
        };
    }
}

PacketManager.packets = new HashMap();

PacketManager.registerPackets = function () {
    PacketManager.registerPacket(0x00, "in", 'NONE', require("./Incoming/PacketHandshake"));

    // STATUS
    PacketManager.registerPacket(0x00, "in", 'STATUS', require("./Incoming/PacketStatusRequest"));
    PacketManager.registerPacket(0x01, "in", 'STATUS', require("./Incoming/PacketPing"));

    // LOGIN
    PacketManager.registerPacket(0x00, "in", 'LOGIN', require("./Incoming/PacketLoginStart"))
};

module.exports = PacketManager;
