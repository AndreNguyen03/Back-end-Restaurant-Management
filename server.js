import app from "./app.js";
import http from 'http';
import {setupSocket} from "./socket.js";

const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 3055;

server.listen(PORT, () => {
  console.log(`server start with ${PORT}`);
});
