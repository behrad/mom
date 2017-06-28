const through = require('through2')
const throughv = require('throughv')

const Redis = require('ioredis');
const client = new Redis({
  db: 13
});


client._getPipeline = function () {
  if (!this._pipeline) {
    this._pipeline = client.pipeline()
    process.nextTick(execPipeline, this)
  }
  return this._pipeline
}

function execPipeline (that) {
  that._pipeline.exec()
  that._pipeline = null
}


function populate() {
  let num = 989395336380;
  for (let i=0; i<1000000; i++) {
    client._getPipeline()
      .hset('largeHash:sub:client:app/adp-nms-push/user/'+num+++'/default', 'app/adp-nms-push/user/989395336380/default', '121212122121212121212121212', console.log)
  }
}

function readList() {
  console.time('hash_scan')
  console.time('total')
  const ths = through.obj(function(key, enc, cb){
    this.push(key)
    cb()
  })

  ths.on('data', function(key){
    client.hgetallBuffer(key, finish)
    client.hgetallBuffer(key, finish)
    client.hgetallBuffer(key, finish)
    client.hgetallBuffer(key, finish)
    client.hgetallBuffer(key, finish)
  })

  function finish() {
    if(called === 0) {
      console.time('hgetall')
    }
    called++;
    if (finished && called === count * 5 ) {
      console.timeEnd('hgetall')
      console.timeEnd('total')
    }
  }

  let called = 0;
  let finished = false;
  let count = 0;

  const stream = client.scanStream({
    match: "sub:client:*",
    count: 500
  });
  stream.on('data', function(moreKeys){
    count += moreKeys.length
    for (let i = 0; i < moreKeys.length; i++) {
      ths.write(moreKeys[i])
    }
  });
  stream.on('end', function(){
    finished = true
    console.timeEnd('hash_scan')
  });
}

// populate()
readList()



// inc counter:offline:clients
// 1. hmset client:sub:{clientId} topic1 qos1 topic2 qos2
// 2. sadd sub:client topic1 topic2
// 3. hset sub:client:{topic} clientId msgpack.encode({clientId, topic, qos})

// outgoing, outgoing-id, will, retained