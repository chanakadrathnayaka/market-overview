import WebSocket, {WebSocketServer} from 'ws';

const clientMap = new Map<string, Set<WebSocket.WebSocket>>();

const register = () => {
  const wss = new WebSocketServer({port: 3001, path: '/trades'});
  const finnHubWebSocket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

  setInterval(() => {
    console.log(clientMap.size)
  }, 2000)
  wss.on('connection', (ws: WebSocket.WebSocket) => {
    ws.on('message', (data) => {
      setImmediate(addClient.bind(null, ws, finnHubWebSocket, data.toString()));
    });
  });

  finnHubWebSocket.addEventListener('message', (event) => {
    setImmediate(broadcast.bind(null, event.data as string, finnHubWebSocket));
  });
};

const addClient = (ws: WebSocket.WebSocket, finnHubWebSocket: WebSocket, symbol: string) => {
  finnHubWebSocket.send(`{"type":"subscribe","symbol":"${symbol}"}`);

  if (clientMap.has(symbol)) {
    clientMap.get(symbol)?.add(ws);
  } else {
    const wsSet = new Set<WebSocket.WebSocket>();
    wsSet.add(ws);
    clientMap.set(symbol, wsSet);
  }
}

const broadcast = (rawResponse: string, finnHubWebSocket: WebSocket) => {
  const response: { data: TradeData[], type: string } = JSON.parse(rawResponse);
  if (response && response.data && response.data.length) {
    response.data.forEach(d => {
      const clients: Set<WebSocket.WebSocket> | undefined = clientMap.get(d.s);
      if (clients && clients.size) {
        let allClosed = true;
        clients.forEach(c => {
          if (c.readyState === 1) {
            allClosed = false;
            c.send(JSON.stringify(d))
          }
        });

        if (allClosed) {
          unsubscribe(d.s, finnHubWebSocket);
          clientMap.delete(d.s);
        }
      }
    })
  }
}

const unsubscribe = (symbol: string, socket: WebSocket) => {
  socket.send(`{"type":"unsubscribe","symbol":"${symbol}"}`)
}

interface TradeData {
  p: number;
  s: string;
  t: number;
  v: number;
}

export const TradeWS = {register};
