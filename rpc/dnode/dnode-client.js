const dnode = require('dnode');
const bench = require('fastbench')

const d = dnode.connect(5004);
d.on('remote', function (remote) {
  function call (cb) {
    remote.transform('behrad', function (s) {
      // console.log('behrad => ' + s);
      cb();
    });
  }

  bench([call], 10000)();
});