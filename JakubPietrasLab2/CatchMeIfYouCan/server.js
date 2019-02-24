const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

const clientsDb = [];
const chatLog = [{id: 'server', message: '[setup finished]'}];

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const parsedData = JSON.parse(message);
    console.log(`Received: ${message}`);

    if (parsedData.type === 'chat') {
      chatLog.unshift(parsedData.data);

      wss.clients.forEach(client => {
        client.send(JSON.stringify({type: 'chat', chatLog}));
      });
    }

    if (parsedData.type === 'position') {
      const clientRecord = clientsDb.find(client => client.id === parsedData.data.id);
      
      if (clientRecord) {
        clientRecord.lat = parsedData.data.lat;
        clientRecord.lng = parsedData.data.lng;
      } else {
        clientsDb.push(parsedData.data);
      }

      wss.clients.forEach(client =>
        client.send(JSON.stringify({type: 'players', players: clientsDb}))
      );
    }
  });

  ws.send(JSON.stringify({type: 'chat', chatLog}));
  ws.send(JSON.stringify({type: 'players', players: clientsDb}));
});
