const nano = require('nanomsg');
const bench = require('fastbench');


// const socket = nano.socket('pub');
const socket = nano.socket('req');

const addr = 'tcp://127.0.0.1:6789';

// socket.bind(addr);
socket.connect(addr);

// setInterval(_ => {
//   socket.send("Hello from nanomsg!");
// }, 1000);

function sendReq(done) {
  socket.on('data', function (buf) {
    console.log('received response: ', buf.toString());
    done && done();
  });
  socket.send('hello');
}


const run = bench([sendReq], 1000);
run(run);