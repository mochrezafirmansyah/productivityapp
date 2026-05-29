'use strict';
// Run: npm install && node server.js
// Display board : http://localhost:3000/
// Operator panel: http://localhost:3000/operator.html

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const fs   = require('fs');
const path = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);
const PORT   = process.env.PORT || 3000;
const DATA   = path.join(__dirname, 'data', 'schedules.json');

const DEFAULTS = [
  { id:'1',  scheduledTime:'07:00', destination:'Bangsal',        company:'Kuda Hitam Express',  status:'SCHEDULED', note:'' },
  { id:'2',  scheduledTime:'07:30', destination:'Gili Trawangan', company:'Blue Water Express',  status:'SCHEDULED', note:'' },
  { id:'3',  scheduledTime:'08:00', destination:'Gili Meno',      company:'Wahana Gili Ocean',   status:'SCHEDULED', note:'' },
  { id:'4',  scheduledTime:'08:30', destination:'Bangsal',        company:'Marina Srikandi',     status:'SCHEDULED', note:'' },
  { id:'5',  scheduledTime:'09:00', destination:'Gili Trawangan', company:'Gili Getaway',        status:'SCHEDULED', note:'' },
  { id:'6',  scheduledTime:'09:30', destination:'Bangsal',        company:'Kuda Hitam Express',  status:'SCHEDULED', note:'' },
  { id:'7',  scheduledTime:'10:00', destination:'Gili Meno',      company:'Blue Water Express',  status:'SCHEDULED', note:'' },
  { id:'8',  scheduledTime:'10:30', destination:'Gili Trawangan', company:'Marlin Boat',         status:'SCHEDULED', note:'' },
  { id:'9',  scheduledTime:'11:00', destination:'Bangsal',        company:'Wahana Gili Ocean',   status:'SCHEDULED', note:'' },
  { id:'10', scheduledTime:'11:30', destination:'Gili Trawangan', company:'Kuda Hitam Express',  status:'SCHEDULED', note:'' },
  { id:'11', scheduledTime:'12:00', destination:'Gili Meno',      company:'Marina Srikandi',     status:'SCHEDULED', note:'' },
  { id:'12', scheduledTime:'13:00', destination:'Bangsal',        company:'Blue Water Express',  status:'SCHEDULED', note:'' },
  { id:'13', scheduledTime:'14:00', destination:'Gili Trawangan', company:'Wahana Gili Ocean',   status:'SCHEDULED', note:'' },
  { id:'14', scheduledTime:'15:00', destination:'Bangsal',        company:'Gili Getaway',        status:'SCHEDULED', note:'' },
  { id:'15', scheduledTime:'16:00', destination:'Gili Trawangan', company:'Kuda Hitam Express',  status:'SCHEDULED', note:'' },
  { id:'16', scheduledTime:'17:00', destination:'Bangsal',        company:'Marlin Boat',         status:'SCHEDULED', note:'' },
];

function ensureDir() {
  const dir = path.dirname(DATA);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load() {
  try {
    if (fs.existsSync(DATA)) return JSON.parse(fs.readFileSync(DATA, 'utf8'));
  } catch (e) {
    console.error('Data load error:', e.message);
  }
  return [...DEFAULTS];
}

function save(schedules) {
  ensureDir();
  fs.writeFileSync(DATA, JSON.stringify(schedules, null, 2));
}

ensureDir();
if (!fs.existsSync(DATA)) save(DEFAULTS);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/',                     (_req, res) => res.redirect('/display.html'));
app.get('/api/schedules',        (_req, res) => res.json(load()));

app.post('/api/schedules', (req, res) => {
  const list  = load();
  const entry = { scheduledTime:'', destination:'', company:'', status:'SCHEDULED', note:'', ...req.body, id: Date.now().toString() };
  list.push(entry);
  save(list);
  io.emit('update', list);
  res.json(entry);
});

app.put('/api/schedules/:id', (req, res) => {
  const list = load();
  const i    = list.findIndex(s => s.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });
  list[i] = { ...list[i], ...req.body, id: req.params.id };
  save(list);
  io.emit('update', list);
  res.json(list[i]);
});

app.delete('/api/schedules/:id', (req, res) => {
  const list = load().filter(s => s.id !== req.params.id);
  save(list);
  io.emit('update', list);
  res.json({ ok: true });
});

app.post('/api/reset', (_req, res) => {
  const fresh = DEFAULTS.map(d => ({ ...d }));
  save(fresh);
  io.emit('update', fresh);
  res.json({ ok: true });
});

io.on('connection', socket => {
  socket.emit('update', load());
});

server.listen(PORT, () => {
  console.log(`\n  ⚓  Gili Air Harbour Display\n`);
  console.log(`  Display board : http://localhost:${PORT}/`);
  console.log(`  Operator panel: http://localhost:${PORT}/operator.html\n`);
});
