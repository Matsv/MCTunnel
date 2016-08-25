let PacketManager = require("./packets/PacketManager");
let PacketBuffer = require("./packets/PacketBuffer");

let PacketHandshake = require("./packets/Incoming/PacketHandshake");
let PacketPing = require("./packets/Incoming/PacketPing");
let PacketStatusRequest = require("./packets/Incoming/PacketStatusRequest");
let PacketStatusResponse = require("./packets/Outgoing/PacketStatusResponse");

let PacketLoginStart = require("./packets/Incoming/PacketLoginStart");
let PacketLoginKick = require("./packets/Outgoing/PacketLoginKick");

var net = require('net');
var dns = require('dns');
var config = require("./config.json");

class Client {
    constructor(socket) {
        this._protocol = -1;
        this._state = 'NONE';
        this._host = "";
        this.port = 25565;
        this._connection = socket;
        this._remote = null;
        this._proxy = false;
        this.lastError = "Unknown";
        this.username = "notset";
        this.allowed = false;
        this._connected = true;
    }

    set setPingValue(value) {
        this.pingvalue = value;
    }

    set setProtocol(value) {
        this._protocol = value;
    }

    set setState(value) {
        this._state = value;
    }

    setProxy() {
        this._proxy = true;
        this._connection.pipe(this._remote).pipe(this._connection);
    }

    isAllowedIp(ip) {
        for (let i = 0; i < config.allowed_ips.length; i++)
            if (ip === config.allowed_ips[i])
                return true;
        return false;
    }

    set setHost(value) {
        if (!this.isAllowedIp(this._connection.remoteAddress)) {
            if (this.getState === 'STATUS') {
                let motd = this.getErrorMotd("Ssssssh, this is top secret");
                new PacketStatusResponse(motd).send(this);
            } else if (this.getState === 'LOGIN') {
                let msg = this.getErrorLogin("Ssssssh, this is top secret");
                new PacketLoginKick(msg).send(this);
            }
            return;
        }
        if (value.endsWith(config.host)) {
            let split = value.split(".");
            let split2 = config.host.split(".");
            let domain = split.slice(0, split.length - split2.length);
            if (domain.length > 1 && domain[domain.length - 1].split("-").length === 2) {
                let dow = domain[domain.length - 1];
                let split = dow.split("-");
                let portca = split[split.length - 1];
                let parsed = parseInt(portca);
                if (parsed > 0 && parsed < 65535) {
                    this.port = parsed;
                    domain[domain.length - 1] = split[0];
                }
            }
            this.allowed = true;
            this.host = domain.join(".");
            console.log(this.host);
        } else {
            if (this.getState === 'STATUS') {
                let motd = this.getErrorMotd("No valid host");
                new PacketStatusResponse(motd).send(this);
            } else if (this.getState === 'LOGIN') {
                let msg = this.getErrorLogin("No valid host");
                new PacketLoginKick(msg).send(this);
            }
        }
    }

    get getState() {
        return this._state;
    }

    get getProtocol() {
        return this._protocol;
    }

    set setUsername(value) {
        this.username = value;
        console.log(value + " is trying to login");
    }

    get getUsername() {
        return this.username;
    }

    data(data) {
        this._connection.write(data);
    }

    lookup(host, port, callback) {
        if (port == 25565) {
            dns.resolveSrv("_minecraft._tcp." + host, function (err, addresses) {
                if (addresses && addresses.length > 0) {
                    callback(addresses[0].name, addresses[0].port);
                } else {
                    callback(host, port);
                }
            });
        } else {
            callback(host, port);
        }
    }

    connect(client) {
        if (!this.allowed)
            return;
        this.lookup(client.host, client.port, function (host, port) {
            client._remote = new net.Socket();
            client._remote.connect(port, host);
            client._remote.setTimeout(1000 * 2);
            client._remote.on('connect', function () {
                client.setProxy();
                console.log("Connected to " + client.host);
                if (client.getState == 'STATUS') {
                    let handshake = new PacketHandshake(client._protocol, host, port, 1);
                    client._remote.write(handshake.getBuffer());
                    let status = new PacketStatusRequest();
                    client._remote.write(status.getBuffer());
                } else if (client.getState == 'LOGIN') {
                    let handshake = new PacketHandshake(client._protocol, host, port, 2);
                    client._remote.write(handshake.getBuffer());
                    let login = new PacketLoginStart(client.getUsername);
                    client._remote.write(login.getBuffer());
                    client.setState = "ENCRYPTED_PLAY";
                }
            });

            client._remote.on('error', function (err) {
                console.log(err);
                client.lastError = err;
            });

            client._remote.on('close', function (err) {
                client._proxy = false;
                if (!client._connected)
                    return;
                if (client.getState == 'STATUS') {
                    let response = client.getErrorMotd(client.lastError.code);
                    let packet = new PacketStatusResponse(response);
                    client._connection.write(packet.getBuffer(), function (err) {
                        client._connection.end();
                    });
                } else if (client.getState == 'LOGIN') {
                    let response = client.getErrorLogin(client.lastError.code);
                    new PacketLoginKick(response).send(client);
                    try {
                        client._connection.destroy();
                    } catch (e) {
                        console.log("Failed to destroy connection: " + e);
                    }
                } else {
                    if (client._connection != null)
                        client._connection.destroy();
                }

            });
        });
    }

    getErrorMotd(err) {
        return {
            "version": {
                "name": "Error",
                "protocol": -1
            },
            "players": {
                "max": 0,
                "online": 0,
                "sample": []
            },
            "description": {
                "text": "",
                "extra": [
                    {"text": "ERROR: ", "color": "red", "bold": true},
                    {
                        "text": err,
                        "color": "gray",
                        "bold": false
                    }, {"text": "\nPlease don't break my system", "color": "white", "italic": true}]
            },
            "favicon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAApVBMVEUAAADxWTpEREBEREDxWTrxWTrxWTruWTpEREBEREDxWTrxWTrsWDrZVjtEREBEREDqWDrSVTtEREBEREDuWTrpWDrrWDpEREBEREDcVjtEREBEREDYVjvtWTrpWDrnWDrFVDzmWDrwWTrvWTroWDrlWDraVjvxWTrvWTrxWTrxWTrqWDrmWDrlWDrxWTrwWTrrWDrqWDrpWDroWDrnWDrsWDruWTrAKR9TAAAALnRSTlMAMAIDEFDvMQUBz2DvNggH8DgJCmHwMQsNaA4PamEy8Dzwn6BjZGlwsCCfoqOjSumyzAAAAmJJREFUWMOt131XmzAUBvAUOgSzwQQdDHzv1m3ogja47//RlqSF3IS8gNj/vMffc07l+oQg9JGfzQahIAzDQJvD2fbTdDb6KDqL+SdRxgmcbc8J1mfSk+7zlzTNNJ+lcsY8YQnKDPqX168Xuebzoihy6Am5hDPoD5TSq2/q1y+rqioDxXeH73IGPe37nnbRBvq6aZpa8+z3rmurJwQk2HxPb+weJNh9J56FxY8JLk9ggu5PCW4PEqZeJPj8mCCen+ZZwq3XnxLE/lDdk+7u3uuPCREhb6904mn/cO/1hJwFCJN/LGDq+/7u1usf4xChGxZwMPhhJx1+l/GA8Mfbi9Efn6bL56kIiH9aPE9w+bJI44AHJNjiWYLD1xUL4AvH/q+xxTtmu7qpCtkp+B2+qWCn4OW+KZVOwou93il4pWcJKz0K9it93Vyv9E2zX+nrAK/03p30es9O2nxSgvkvu/9t83k1o/+0noQ+K6pZHvbkYPmPcVpU87zsycHzRgpYQDnTa2d3cuzEOM1ne/XsHjoxS+Z7eHbLTlziwdkNOnGJl2c37MQlfjy7lU5c4oezu3y3n+7kUq/v5HKv7qTr/NvP2EmXd/XkkOD2rp70vz/4elIkeL2rJ6M/CLVe7+jJ8y0SCYb3RLU/scOzBNN7ota/2OFR8jR9T5z0Nzb7Uyc+U3//Y6MfOvGv//zQz27hZSe2Xq/tJPdKJ7Zer+yk8Gonjgk7eE8b+1PMsOq1Tjwl7Ax3wvHuiMH35zP17ikSHg13UnBPxfLvZ7i7tvz93XN3xsPzM9ydWULru7uzBLF/cvYfwpq+9Ei0TdEAAAAASUVORK5CYII="
        };
    }

    getErrorLogin(err) {
        return {
            "text": "",
            "extra": [{
                "text": "Woops! Something did go wrong while connecting to ",
                "color": "dark_red"
            }, {
                "text": this.host + "" + ((this.port != 25565) ? ( ":" + this.port) : ""),
                "color": "dark_gray",
                "bold": true
            }, {
                "text": "\n\nError: ",
                "color": "red",
                "bold": false
            }, {"text": err, "color": "gray"}]
        };
    }

    handle(buffer) {
        if (this._proxy)
            return;
        let packetBuf = new PacketBuffer(buffer);
        packetBuf.init();

        let packet = PacketManager.getPacketFromBuffer(this.getState, "in", packetBuf);
        packet.packet.handle(this);

        while (packet.remainingBytes != 0) {
            packetBuf = new PacketBuffer(packetBuf.buffer, packet.offset);
            packetBuf.init();
            packet = PacketManager.getPacketFromBuffer(this.getState, "in", packetBuf);
            packet.packet.handle(this);
        }

        delete packetBuf.buffer;
    }

    send(buffer) {
        this._connection.write(buffer);
    }

    close() {
        if (this._remote != null) {
            try {
                this._remote.destroy();
            } catch (e) {
                console.log("Could not destroy remote: " + e);
            }
        }
    }
}

module.exports = Client;