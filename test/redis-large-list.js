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
    client._getPipeline().lpush('test_large_list', 'sub:client:app/adp-nms-push/user/'+ num++ +'/default')
  }
}

function readList() {
  client
    .lrange('test_large_list', 0, -1)
    .then(list => console.log(list))
}

populate();
// readList()