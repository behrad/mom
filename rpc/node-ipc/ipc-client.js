const ipc = require('node-ipc');
const bench = require('fastbench')

ipc.config.id = 'hello';
ipc.config.retry = 1000;
ipc.config.silent = true;

ipc.connectTo(
  'world',
  function(){
    ipc.of.world.on(
      'connect',
      function(){
        ipc.log('## connected to world ##', ipc.config.delay);
        var callbacks = []
        function call (cb) {
          ipc.of.world.emit(
            'app.message',
            {
              id      : ipc.config.id,
              message : 'hello'
            }
          );
          callbacks.push(cb)
        }
        ipc.of.world.on(
          'app.message',
          function(data){
            // ipc.log('got a message from world : ', data);
            callbacks.pop()()
          }
        );
        bench([call], 50000)();
      }
    );
    ipc.of.world.on(
      'disconnect',
      function(){
        ipc.log('disconnected from world');
      }
    );

  }
);

