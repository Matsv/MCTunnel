MCTunnel
===================

MCTunnel is a project that allows you to join Minecraft servers tunneled through your own server using DNS wildcards.

I created this as personal project to learn JavaScript/Node.JS. The code won't be great, and I probably didn't follow any file naming / project structure rules by looking at other Node.JS projects. 
Every suggestion / PR to improve is welcome.

Running
-------------
**Requirements**:  Node.JS, knowledge how to setup a DNS wildcard.

1. Setup a DNS wildcard and change the value of 'host' in config.json to your DNS record.
2. Add your ip to allowed ips.
3. Start the Node.JS application with `npm start` or `node mctunnel.js`
4. Add yourserver.mywildcard.com to your Minecraft list (For example: My wildcard is test.matsv.nl and I want to join Hypixel: `mc.hypixel.net.test.matsv.nl`, this will show the motd from the server(In this case Hypixel) and let you connect to it. 

License
-------
This project uses the MIT license, see [LICENSE.md](https://github.com/Matsv/MCTunnel/blob/master/LICENSE.md) for more information.
