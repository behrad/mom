const cp = require('child_process');

const n = cp.fork(`${__dirname}/client.js`);

n.on('message', (msg) => {
  n.send({ hello: 'world' });
});


const m = cp.fork(`${__dirname}/client.js`);

m.on('message', (msg) => {
  m.send({ hello: 'world' });
});

