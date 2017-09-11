const nano = require('nanomsg');

const socket = nano.socket('rep');
// const socket = nano.socket('sub');

const addr = 'tcp://127.0.0.1:6789';

socket.bind(addr);
// socket.connect(addr);


// socket.on('data', function (buf) {
//   console.log(String(buf));
// });

socket.on('data', function (buf) {
  console.log('received request: ', buf.toString());
  socket.send('world 2');
});