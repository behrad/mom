const ipc = require('node-ipc');

ipc.config.id = 'world';
ipc.config.retry= 1500;
ipc.config.silent = true;

ipc.serve(
  function(){
    ipc.server.on(
      'app.message',
      function(data,socket){
        ipc.server.emit(
          socket,
          'app.message',
          {
            id      : ipc.config.id,
            message : data.message + ' world!'
          }
        );
      }
    );
  }
);



ipc.server.start();