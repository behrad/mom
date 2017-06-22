const Redis = require('ioredis');
const client = new Redis();


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
  const stream = client.scanStream({
    match: "largeHash:*",
    count: 5000
  });
  stream.on('data', function(moreKeys){
    console.log(moreKeys)
  });
  stream.on('end', function(){
    console.timeEnd('hash_scan')
  });
}

// populate()
readList()