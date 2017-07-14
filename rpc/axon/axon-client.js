const axon = require('axon');
const sock = axon.socket('req');

const bench = require('fastbench');

sock.bind(3000);

function call (cb) {
  sock.send('behrad', function(res){
    cb();
  });
}

bench([call], 10000)()
