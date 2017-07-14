const bench = require('fastbench')

const callbacks = []

process.on('message', (m) => {
  // console.log('CHILD got message:', m);
  callbacks.pop()()
});

function call (cb) {
  process.send({ foo: 'bar' })
  callbacks.push(cb)
}

bench([call], 50000)();