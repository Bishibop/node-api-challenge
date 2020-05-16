const express = require('express');
const cors = require('cors')

const projectRoutes = require('./projects/projectRouter');
const actionRoutes = require('./actions/actionRouter');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/projects', projectRoutes);
server.use('/api/actions', actionRoutes);

server.get('/', (req, res) => {
  res.send(`<h2>Sprint Challenge</h2>`);
});

module.exports = server;
