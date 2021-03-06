const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });

const ws_table = {};
 
wss.on('connection', function connection(ws) {

  const connection_id = (()=>{
    let time = new Date().getTime()
    while( ws_table[time] !== undefined ){
      time=time/10;
    }
    return `${time}`;
  })();

  ws_table[connection_id] = ws;
  ws.connection_id = connection_id;

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    forwardMessage(ws, JSON.parse(message));
  });

  ws.on('close',()=>{
    console.log('disconnected '+connection_id);
    delete ws_table[connection_id]
  });

  ws.send(JSON.stringify({
    type:'welcome',
    connection_id
  }));
});

function forwardMessage( ws_from, action_obj ){

  // initial set up 
  if( action_obj.type !== undefined ){
    ws_from.type = action_obj.type;
    return; // return because we won't forward to itself any way 
  }

  for(let k in ws_table ){
    const ws = ws_table[k];
    if( ws.type==="host" && ws!==ws_from ){
      ws.send(JSON.stringify(action_obj));
    }
  }
}
