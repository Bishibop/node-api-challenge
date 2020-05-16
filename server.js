const express = require('express');
const projectRoutes = require('./projects/projectRouter');
//const actionRoutes = require('./actions/actionRouter');

const server = express();

server.use(express.json());
server.use(logger);
server.use('/api/projects', projectRoutes);
//server.use('/api/projects/:id/actions', actionRoutes);

server.get('/', (req, res) => {
  res.send(`<h2>Sprint Challenge</h2>`);
});

function logger(req, res, next) {
  console.log('Request info: ', req.method, req.url, new Date().toISOString());
  next();
}

module.exports = server;
