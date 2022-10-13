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

      socket.emit("saludar", "Hola desde el servidor!");
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} left`);
      // const jugadorIndex = jugadores.findIndex((item) => item.id === socket.id);
      // jugadores.splice(jugadorIndex, 1);
      console.log(jugadores);
    });

    socket.on("admin-limpiar", (data) => {
      jugadores = [];
      console.log("Se han limpiado los jugadores!");
      console.log("Listado actual:", jugadores);
      socket.emit("admin-limpiar-res", { ...jugadores });
    });

    socket.on("obtener-listado", (data) => {
      socket.emit("listado-actual", jugadores);
      // console.log("Listado actual:", jugadores);
    });

    // EVENTOS DEL JUEGO

    // Unirse al juego
    socket.on("joinGame", (mokepon) => {
      // const newId = Math.random();
      jugadores.push({ ...mokepon });
      console.log(jugadores);

      // io.to(socket.id).emit("newId", newId);
      // console.log(mokepon);
    });

    // Salir del juego
    socket.on("reset", (id) => {
      const jugadorIndex = jugadores.findIndex((item) => item.id === id);
      console.log(`eliminando ${jugadores[jugadorIndex]}`);
      jugadores.splice(jugadorIndex, 1);
      // socket.disconnect();
      console.log(jugadores);
    });

    // Actualizar posición en el mapa
    socket.on("pos", (newPos) => {
      // console.log(newPos);

      // const enemigos = jugadores.filter((item) => {
      //   return item.id !== socket.id; // Aquí la validación
      // });

      const jugadorIndex = jugadores.findIndex((item) => item.id === newPos.id);

      if (jugadores[jugadorIndex]) {
        jugadores[jugadorIndex].x = newPos.posX;
        jugadores[jugadorIndex].y = newPos.posY;
      }

      // console.log(
      //   "x:",
      //   jugadores[jugadorIndex].x,
      //   "y:",
      //   jugadores[jugadorIndex].y
      // );

      // console.log(jugadores);

      io.emit("allPos", jugadores);
    });

    // Eviar y recibir ataques
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
