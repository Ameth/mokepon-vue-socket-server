module.exports = (httpServer) => {
  const { Server } = require("socket.io");

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let jugadores = [];

  io.on("connection", (socket) => {
    console.log(socket.id);

    // const cookie = socket.handshake.headers.cookie;
    // const username = cookie.split("=").pop();
    // console.log(cookie);

    socket.on("saludar", (saludo) => {
      console.log(saludo);
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} left`);
      // const jugadorIndex = jugadores.findIndex((item) => item.id === socket.id);
      // jugadores.splice(jugadorIndex, 1);
      console.log(jugadores);
    });

    // eventos del juego

    // const jugador = (id) => ({
    //   id: id,
    //   x: 0,
    //   y: 0,
    // });

    socket.on("joinGame", (mokepon) => {
      // const newId = Math.random();
      jugadores.push({ ...mokepon });
      console.log(jugadores);

      // io.to(socket.id).emit("newId", newId);
      // console.log(mokepon);
    });

    socket.on("reset", (id) => {
      const jugadorIndex = jugadores.findIndex((item) => item.id === id);
      console.log(`eliminando ${jugadores[jugadorIndex]}`);
      jugadores.splice(jugadorIndex, 1);
      // socket.disconnect();
      console.log(jugadores);
    });

    socket.on("pos", (newPos) => {
      // console.log(newPos);

      // const enemigos = jugadores.filter((item) => {
      //   return item.id !== socket.id; // Aquí la validación
      // });

      const jugadorIndex = jugadores.findIndex((item) => item.id === newPos.id);

      jugadores[jugadorIndex].x = newPos.posX;
      jugadores[jugadorIndex].y = newPos.posY;

      // console.log(
      //   "x:",
      //   jugadores[jugadorIndex].x,
      //   "y:",
      //   jugadores[jugadorIndex].y
      // );

      // console.log(jugadores);

      io.emit("allPos", jugadores);
    });

    socket.on("atacar", ({ ataque, id, idEnemigo }) => {
      // console.log("Ataque enviado:", ataque);
      const jugadorIndex = jugadores.findIndex((item) => item.id === id);

      jugadores[jugadorIndex].ataques = ataque;

      // console.log(
      //   `${id} ataco a ${idEnemigo}: ${jugadores[jugadorIndex].ataques}`
      // );

      // io.to(idEnemigo).emit("recibirAtaque", jugadores[jugadorIndex].ataques);
      io.emit("recibirAtaque", {
        ataques: jugadores[jugadorIndex].ataques,
        id: jugadores[jugadorIndex].id,
      });
    });
  });
};
