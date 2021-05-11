//
// Configuração dos módulos
const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').createServer({}, app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});
const cors = require('cors');
const path = require('path');
//
fs.access("./config/server.config.json", fs.constants.F_OK, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('- Arquivo "./config/server.config.json" não existe');
      var modelo = {
        "_comment_host": "Configuração do host",
        "host": "0.0.0.0",
        "port": "9000",
        "_comment_jwt": "Configuração do jwt",
        "jwt_secret": "09f26e402586e2faa8da4c98a35f1b20d6b033c60",
      };
      console.log("- Modelo do arquivo de configuração:\n", modelo);
      process.exit(1);
    } else {
      console.error('- Arquivo "server.config.json" existe');
    }
  } else {
    console.error('- Arquivo "server.config.json" existe');
  }
});
//
const sistem = require("./controllers/sistem.controller");
const serverConfig = require("./config/server.config.json");
const Sessions = require("./sessions.js");
//
app.use(cors());
//
// Express Parser
app.use(express.json({
  limit: '50mb',
  extended: true
}));
//
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));
//
//
http.listen(serverConfig.port, serverConfig.host, function(err) {
  if (err) {
    console.log(err);
  } else {
    const host = http.address().address;
    const port = http.address().port;
    console.log(`- HTTP Server running on: ${host}:${port}`);
  }
});
//
// Rotas
app.use("/sistema", sistem);
//
app.get('/', function(req, res) {
  res.send('Server is running');
});
//
process.stdin.resume(); //so the program will not close instantly
//
async function exitHandler(options, exitCode) {
  if (options.cleanup) {
    console.log("- Cleanup");
    await Sessions.getSessions().forEach(async session => {
      await Sessions.closeSession(session.sessionName);
    });
  }
  if (exitCode || exitCode === 0) {
    console.log(exitCode);
  }
  //
  if (options.exit) {
    process.exit();
  }
} //exitHandler

//
//do something when sistema is closing
process.on('exit', exitHandler.bind(null, {
  cleanup: true
}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
  exit: true
}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
  exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
  exit: true
}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
  exit: true
}));
//
// ------------------------------------------------------------------------------------------------//
//
//