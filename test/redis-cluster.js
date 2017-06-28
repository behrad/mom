const Redis = require('ioredis');

const cluster = new Redis.Cluster([{
  port: 7000,
  host: '10.10.101.156'
}, {
  port: 7001,
  host: '10.10.101.156'
}, {
  port: 7002,
  host: '10.10.101.156'
}]);


cluster.on('ready', _ => {
  console.log('Ready')
})

cluster.on('connect', _ => {
  console.log('connect')
})

cluster.on('error', e => {
  console.error('E ', e)
})



const masters = cluster.nodes('master');
Promise.all(masters.map(function (node) {
  const stream = node.scanStream({
    match: 'sub:client:*',
    count: 100
  });
  const keys = [];
  stream.on('data', function (resultKeys) {
    keys.push(resultKeys);
  });
  stream.on('end', function () {
    console.log('done with the keys: ', keys);
  });
  return node.keys('*');
})).then(function (keys) {
  // console.log(keys)
}).catch(console.error)
