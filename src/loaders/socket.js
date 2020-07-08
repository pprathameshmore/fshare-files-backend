const socketio = require("socket.io");

module.exports = (server) => {
  console.log("Socket is listening");
  return (io = socketio(server));
};
