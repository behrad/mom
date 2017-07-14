const tentacoli = require('tentacoli');
const net = require('net');
const from = require('from2');
const bench = require('fastbench');
const through = require('through2');
const pump = require('pump');

const original = net.connect(4200);
const instance = tentacoli();
pump(original, instance, original);

function sendReq(done) {
  instance.request({
    cmd: 'req_command',
    streams: {
      inStream: from.obj(['hello', 'world'])
    }
  }, function (err, result) {
    if (err) {
      throw err
    }

    // console.log('--> result is', result.data);
    // console.log('--> stream data:');

    // result.streams.echo.pipe(through.obj(function (chunk, enc, cb) {
    //   cb(null, chunk + '\n')
    // })).pipe(process.stdout);

    // result.streams.echo.on('end', function () {
      // console.log('--> ended');
      // instance.destroy();
      // done();
    // })
    done();
  });
}


const run = bench([sendReq], 1000);
run(run);