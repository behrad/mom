const axon = require('axon');
const sock = axon.socket('rep');

sock.connect(3000);

sock.on('message', function(img, reply){
  reply(img + ' ok!');
});