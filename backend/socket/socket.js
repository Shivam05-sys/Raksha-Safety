module.exports = io => {
  io.on(
    "connection",
    socket => {
      console.log(
        "User Connected"
      );

      socket.on(
        "locationUpdate",
        data => {
          io.emit(
            "liveLocation",
            data
          );
        }
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            "Disconnected"
          );
        }
      );
    }
  );
};