const WebSocket = require('ws');
const server = new WebSocket.Server({
  port: 3000
});

let sockets = [];
server.on('connection', function(socket) {
  // Adicionamos cada nova conexão/socket ao array `sockets`
  sockets.push(socket);
  // Quando você receber uma mensagem, enviamos ela para todos os sockets
  socket.on('message', function(msg) {
    const data = JSON.parse(msg);

    switch(data.process) {
        case 'newUser':
          socket.id = `${data.name}` ;
          
          sockets.forEach((socket) => {
            const user = {
              user: socket.id,
              process: 'newUsers'
            }
            
            sockets.forEach(s => s.send(JSON.stringify(user)));
          })

          break;

        case 'vote':
            const result = {
                user: socket.id,
                value: data.value,
                process: 'vote'
            }

            sockets.forEach(s => s.send(JSON.stringify(result)));
        break;

        case 'flip':
            sockets.forEach(s => s.send(JSON.stringify({ process: 'flip' })));
            break;

        case 'reset':
            sockets.forEach(s => s.send(JSON.stringify({ process: 'reset' })));
            break;
    }
  });
  // Quando a conexão de um socket é fechada/disconectada, removemos o socket do array
  socket.on('close', function() {
    const removeUser = {
      user: socket.id,
      process: 'removeUser'
    }
      
    sockets.forEach(s => s.send(JSON.stringify(removeUser)));


    sockets = sockets.filter(s => s !== socket);
  });
});
