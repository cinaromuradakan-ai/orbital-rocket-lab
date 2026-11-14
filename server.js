const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const GAME_FILE = path.join(__dirname, 'orbital_rocket_lab_lan_fixed.html');
const clients = new Map();
const MAX_NAME = 18;
const MAX_MODULES = 14;

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('ok');
  }
  if (req.method !== 'GET' || (req.url !== '/' && req.url !== '/index.html')) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
  fs.readFile(GAME_FILE, (err, html) => {
    if (err) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Game file missing. Check deployment files.');
    }
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    });
    res.end(html);
  });
});

const wss = new WebSocket.Server({ server, maxPayload: 16 * 1024 });
function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}
function broadcast(data, except) {
  for (const client of wss.clients) if (client !== except) send(client, data);
}

wss.on('connection', ws => {
  send(ws, { type: 'roster', players: [...clients.values()].map(({ socket, ...p }) => p) });
  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg.type !== 'state' || typeof msg.id !== 'string') return;
    const state = {
      type: 'state',
      id: msg.id.slice(0, 80),
      name: String(msg.name || 'Astronot').replace(/[<>]/g, '').slice(0, MAX_NAME),
      pos: Array.isArray(msg.pos) ? msg.pos.slice(0, 3).map(v => Number.isFinite(Number(v)) ? Math.max(-1e7, Math.min(1e7, Number(v))) : 0) : [0, 0, 0],
      rot: Number(msg.rot) || 0,
      modules: Array.isArray(msg.modules) ? msg.modules.slice(0, MAX_MODULES).filter(v => typeof v === 'string').map(v => v.slice(0, 24)) : [],
      altitude: Number(msg.altitude) || 0,
      launched: !!msg.launched,
      landed: !!msg.landed
    };
    const previous = clients.get(state.id);
    if (previous && previous.socket !== ws) send(previous.socket, { type: 'peer-left', id: state.id });
    clients.set(state.id, { ...state, socket: ws });
    broadcast(state, ws);
  });
  ws.on('close', () => {
    for (const [id, state] of clients) {
      if (state.socket === ws) {
        clients.delete(id);
        broadcast({ type: 'peer-left', id });
      }
    }
  });
});

server.listen(PORT, HOST, () => console.log(`ORBITAL public server listening on ${HOST}:${PORT}`));
