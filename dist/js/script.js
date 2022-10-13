const socket = io();

// socket.emit("saludar", "Hola desde el cliente!");
// socket.on("saludar", (saludo) => {
//   console.log(saludo);
// });

const dataView = document.getElementById("dataView");
const btnLimpiar = document.getElementById("btnLimpiar");
const dataTotal = document.getElementById("dataTotal");
const dataDetails = document.getElementById("dataDetails");

const mostrarDatos = (data) => {
  dataDetails.innerHTML = "";
  const total = data.length;
  dataTotal.innerText = total;
  data.forEach((item) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");

    td1.innerText = item.nombre;
    td2.innerText = item.id;
    td3.innerText = `${item.x}, ${item.y}`;

    tr.append(td1, td2, td3);

    // const row = document.createRange().createContextualFragment(`
    //     <tr>
    //         <td>${item.nombre}</td>
    //         <td>${item.id}</td>
    //         <td></td>
    //     </tr>`);
    dataDetails.append(tr);
  });
};

btnLimpiar.addEventListener("click", () => {
  socket.emit("admin-limpiar", "");
});

socket.on("admin-limpiar-res", (data) => {
  mostrarDatos(data);
});

let update = setInterval(() => {
  socket.emit("obtener-listado", "");
  //   console.log("Solicitando!");
}, 500);

socket.on("listado-actual", (data) => {
  mostrarDatos(data);
  console.log("listado actual:", data);
});
