const conjunto = [
  'ALGORITMO', 'ANCHO_DE_BANDA', 'ANTIVIRUS', 'API', 'ARCHIVO',
  'ARRAY', 'BACKUP', 'BINARIO', 'BIT', 'BUG',
  'BYTE', 'CACHE', 'CLIENTE', 'CLOUD', 'CLUSTER',
  'CODIGO', 'COMPILADOR', 'COMPUTADORA', 'COOKIE', 'CPU',
  'CIBERSEGURIDAD', 'DATO', 'DEBUG', 'DESARROLLADOR', 'DOMINIO',
  'DRIVER', 'ENCRIPTAR', 'ENSAMBLADOR', 'ETHERNET', 'FIREWALL',
  'FIRMWARE', 'FTP', 'GIGABYTE', 'GPU', 'HARDWARE',
  'HTML', 'HTTP', 'HTTPS', 'INDEX', 'INPUT',
  'INTERNET', 'IP', 'JAVA', 'JAVASCRIPT', 'KERNEL',
  'LAPTOP', 'LENGUAJE', 'LINUX', 'LOGIN', 'MACRO',
  'MALWARE', 'MEMORIA', 'METADATO', 'MODEM', 'MONITOR',
  'MOUSE', 'NAVEGADOR', 'NUBE', 'OCTETO', 'OFFLINE',
  'ONLINE', 'OUTPUT', 'PANTALLA', 'PAQUETE', 'PASSWORD',
  'PATCH', 'PING', 'PIXEL', 'PLUGIN', 'POST',
  'PROCESADOR', 'PROGRAMA', 'PROGRAMADOR', 'PROTOCOLO', 'PROXY',
  'QUERY', 'RAM', 'RED', 'REBOOT', 'RECURSO',
  'ROOT', 'ROUTER', 'SCRIPT', 'SEGURIDAD', 'SERVIDOR',
  'SHELL', 'SOFTWARE', 'SQL', 'SSH', 'STACK',
  'STREAMING', 'SISTEMA', 'TABLERO', 'TCP', 'TERMINAL',
  'TOKEN', 'UPDATE', 'USB', 'USUARIO', 'VARIABLE',
  'VPN', 'WEB', 'WIFI', 'WINDOWS', 'ZIP', 'FUNA', 'JAIMITO'
];

let tamanio = 10;
let direccionSeleccion = null; // {dx, dy}


function obtenerPalabrasAleatorias(array, cantidad = 6) {
  const copia = [...array];
  const seleccionadas = [];
  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccionadas.push(copia.splice(idx, 1)[0]);
  }
  return seleccionadas;
}

// Ejemplo de uso:
let palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), 6);

let grid = [], seleccion = [], encontradas = [];
let seleccionando = false;
let celdaPalabras = {}; // Nuevo: mapea "x,y" a lista de palabras

function generarGrid() {
  grid = Array.from({ length: tamanio }, () => Array(tamanio).fill(""));
  celdaPalabras = {}; // Reinicia el mapeo
  palabras.forEach(palabra => colocarPalabra(palabra));
  for (let i = 0; i < tamanio; i++)
    for (let j = 0; j < tamanio; j++)
      if (grid[i][j] === "") grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function colocarPalabra(palabra) {
  const direcciones = [[1,0],[0,1],[1,1],[-1,1]];
  let colocada = false;
  let intentos = 0;
  while (!colocada && intentos < 100) {
    let x = Math.floor(Math.random() * tamanio);
    let y = Math.floor(Math.random() * tamanio);
    let [dx, dy] = direcciones[Math.floor(Math.random() * direcciones.length)];
    let puede = true;
    for (let i = 0; i < palabra.length; i++) {
      let nx = x + dx * i, ny = y + dy * i;
      if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio) {
        puede = false; break;
      }
      if (grid[nx][ny] !== "" && grid[nx][ny] !== palabra[i]) {
        puede = false; break;
      }
    }
    if (puede) {
      for (let i = 0; i < palabra.length; i++) {
        let nx = x + dx * i, ny = y + dy * i;
        grid[nx][ny] = palabra[i];
        // Nuevo: registra la palabra en la celda
        const key = nx + "," + ny;
        if (!celdaPalabras[key]) celdaPalabras[key] = [];
        celdaPalabras[key].push(palabra);
      }
      colocada = true;
    }
    intentos++;
  }
}

let presionando = false;


function iniciarSeleccion(e) {
  // Solo verifica e.button si es un evento de mouse
  if (e.type === "mousedown" && e.button !== 0) return;
  limpiarSeleccion();
  presionando = true;
  seleccion = [];
  marcarCelda(e.target);
}

function mantenerSeleccion(e) {
  if (!presionando) return;
  marcarCelda(e.target);
}

function terminarSeleccion(e) {
  if (!presionando) return;
  presionando = false;
  validarSeleccion();
}

// Touch
function iniciarSeleccionTouch(e) {
  limpiarSeleccion();
  presionando = true;
  seleccion = [];
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    marcarCelda(target);
  }
}
function mantenerSeleccionTouch(e) {
  if (!presionando) return;
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    marcarCelda(target);
  }
}

function limpiarSeleccion() {
  document.querySelectorAll(".cell.selected, .cell.incorrecta").forEach(c => {
    c.classList.remove("selected");
    c.classList.remove("incorrecta");
  });
  seleccion = [];
  direccionSeleccion = null;
}

function marcarCelda(target) {
  if (!target || !target.classList.contains("cell")) return;
  const x = parseInt(target.dataset.x);
  const y = parseInt(target.dataset.y);

  // Evita seleccionar la misma celda dos veces seguidas
  if (seleccion.some(p => p.x === x && p.y === y)) return;

  if (seleccion.length === 0) {
    // Primera celda: siempre se puede seleccionar
    seleccion.push({ x, y, letra: grid[x][y] });
    target.classList.add("selected");
    direccionSeleccion = null;
    return;
  }

  if (seleccion.length === 1) {
    // Segunda celda: define la dirección
    const dx = x - seleccion[0].x;
    const dy = y - seleccion[0].y;
    // Solo permite horizontal, vertical o diagonal perfecta
    if (
      !(
        (dx === 0 && dy !== 0) ||
        (dx !== 0 && dy === 0) ||
        (Math.abs(dx) === Math.abs(dy) && dx !== 0)
      )
    ) {
      return;
    }
    direccionSeleccion = { dx: Math.sign(dx), dy: Math.sign(dy) };
    seleccion.push({ x, y, letra: grid[x][y] });
    target.classList.add("selected");
    return;
  }

  // A partir de la tercera celda, solo permite seguir la dirección
  const last = seleccion[seleccion.length - 1];
  if (
    direccionSeleccion &&
    x - last.x === direccionSeleccion.dx &&
    y - last.y === direccionSeleccion.dy
  ) {
    seleccion.push({ x, y, letra: grid[x][y] });
    target.classList.add("selected");
  }
}

function terminarSeleccionTouch(e) {
  if (!presionando) return;
  presionando = false;
  validarSeleccion();
}

function dibujarGrid() {
  const gridDiv = document.getElementById("grid");
  gridDiv.style.setProperty('--tamanio', tamanio);
  gridDiv.innerHTML = "";
  for (let i = 0; i < tamanio; i++)
    for (let j = 0; j < tamanio; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[i][j];
      cell.dataset.x = i;
      cell.dataset.y = j;
      // Mouse events
      cell.onmousedown = iniciarSeleccion;
      cell.onmouseenter = mantenerSeleccion;
      // Touch events
      cell.ontouchstart = iniciarSeleccionTouch;
      cell.ontouchmove = mantenerSeleccionTouch;
      gridDiv.appendChild(cell);
    }
  gridDiv.onmousedown = e => e.preventDefault();
}

// Escucha mouseup/touchend en el documento para terminar selección
document.addEventListener('mouseup', terminarSeleccion);
document.addEventListener('touchend', terminarSeleccionTouch);


function validarSeleccion() {
  if (seleccion.length < 2) return;
  const palabraFormada = seleccion.map(p => p.letra).join("");
  const palabraReversa = seleccion.map(p => p.letra).reverse().join("");
  let encontrada = null;
  if (palabras.includes(palabraFormada) && !encontradas.includes(palabraFormada)) {
    encontrada = palabraFormada;
  } else if (palabras.includes(palabraReversa) && !encontradas.includes(palabraReversa)) {
    encontrada = palabraReversa;
  }
  if (encontrada) {
    encontradas.push(encontrada);
    seleccion.forEach(p => {
      const key = p.x + "," + p.y;
      // Determina si la celda pertenece a alguna palabra ya encontrada
      let perteneceAEncontrada = false;
      if (celdaPalabras[key]) {
        for (const palabra of celdaPalabras[key]) {
          if (encontradas.includes(palabra)) {
            perteneceAEncontrada = true;
            break;
          }
        }
      }
      document.querySelectorAll(".cell").forEach(c => {
        if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
          c.classList.remove("selected");
          if (perteneceAEncontrada) c.classList.add("found");
        }
      });
    });
    // Además, repinta todas las celdas compartidas por si alguna letra compartida debe actualizarse
    document.querySelectorAll(".cell").forEach(c => {
      const x = parseInt(c.dataset.x), y = parseInt(c.dataset.y);
      const key = x + "," + y;
      let perteneceAEncontrada = false;
      if (celdaPalabras[key]) {
        for (const palabra of celdaPalabras[key]) {
          if (encontradas.includes(palabra)) {
            perteneceAEncontrada = true;
            break;
          }
        }
      }
      if (perteneceAEncontrada) {
        c.classList.add("found");
      } else {
        c.classList.remove("found");
      }
    });
    seleccion = [];
    actualizarLista();
    if (encontradas.length === palabras.length) {
      mostrarModalFelicidades();
    }
  } else {
    // Animación roja y limpiar después de un pequeño delay
    seleccion.forEach(p => {
      document.querySelectorAll(".cell").forEach(c => {
        if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
          c.classList.add("incorrecta");
        }
      });
    });
    setTimeout(() => {
      seleccion.forEach(p => {
        document.querySelectorAll(".cell").forEach(c => {
          if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
            c.classList.remove("selected");
            c.classList.remove("incorrecta");
          }
        });
      });
      seleccion = [];
    }, 400);
  }
}

function actualizarLista() {
  const ul = document.getElementById("wordList");
  ul.innerHTML = "";
  palabras.forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = p;
    if (encontradas.includes(p)) {
      li.classList.add("encontrada-palabra");
    } else {
      li.classList.add("no-encontrada-palabra");
    }
    ul.appendChild(li);
  });
}

function reiniciarJuego() {
  // NO cambies la dificultad aquí, solo usa la actual
  let cantidad = 6;
  if (tamanio >= 14) cantidad = 9;
  if (tamanio >= 18) cantidad = 12;
  palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), cantidad);
  seleccion = []; encontradas = [];
  document.getElementById("mensaje").textContent = "";
  generarGrid(); dibujarGrid(); actualizarLista();
}

function mostrarJuego(visible) {
  // Muestra u oculta el grid y la lista de palabras
  const gridDiv = document.getElementById("grid");
  const wordList = document.getElementById("wordList");
  const btnNueva = document.getElementById("btnNuevaSopa");
  if (gridDiv) gridDiv.style.display = visible ? "" : "none";
  if (wordList) wordList.style.display = visible ? "" : "none";
  if (btnNueva) btnNueva.style.display = visible ? "" : "none";
}

function mostrarNivelDificultad() {
  let texto = "";
  if (tamanio === 10) texto = "Nivel: Fácil (10x10)";
  else if (tamanio === 14) texto = "Nivel: Media (14x14)";
  else if (tamanio === 18) texto = "Nivel: Difícil (18x18)";
  else texto = "Nivel personalizado";
  document.getElementById("nivelDificultad").textContent = texto;
}

function mostrarModalFelicidades() {
  const modal = document.getElementById('modalFelicidades');
  if (!modal) return;
  // Selecciona la dificultad actual en el select
  const select = document.getElementById('dificultad-felicidades');
  if (select) select.value = tamanio;
  modal.hidden = false;
  mostrarJuego(false);

  // Botón volver a jugar
  const btn = document.getElementById('btnVolverJugar');
  if (btn) {
    btn.onclick = function() {
      // Cambia la dificultad si el usuario la seleccionó
      if (select) {
        tamanio = parseInt(select.value);
      }
      let cantidad = 6;
      if (tamanio >= 14) cantidad = 9;
      if (tamanio >= 18) cantidad = 12;
      palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), cantidad);
      seleccion = []; encontradas = [];
      document.getElementById("mensaje").textContent = "";
      generarGrid(); dibujarGrid(); actualizarLista();
      mostrarNivelDificultad();
      modal.hidden = true;
      mostrarJuego(true);
    };
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const modalDiv = document.getElementById('modalDificultad');
  // Si existe el modal, muéstralo y oculta el juego
  if (modalDiv) {
    modalDiv.hidden = false;
    mostrarJuego(false);
    // Botón "Comenzar"
    const btn = document.getElementById('btnElegirDificultad');
    if (btn) {
      btn.onclick = function() {
        const select = document.getElementById('dificultad-modal');
        if (select) {
          tamanio = parseInt(select.value);
        }
        let cantidad = 6;
        if (tamanio >= 14) cantidad = 9;
        if (tamanio >= 18) cantidad = 12;
        palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), cantidad);
        seleccion = []; encontradas = [];
        document.getElementById("mensaje").textContent = "";
        generarGrid(); dibujarGrid(); actualizarLista();
        mostrarNivelDificultad(); // <-- Agrega esto aquí
        // Oculta el modal personalizado y muestra el juego
        modalDiv.hidden = true;
        mostrarJuego(true);
      };
    }
  } else {
    // Si no hay modal, inicializa el juego normalmente
    generarGrid(); dibujarGrid(); actualizarLista();
    mostrarNivelDificultad(); // <-- Agrega esto aquí
    mostrarJuego(true);
  }

  // Botón "Nueva Sopa" ahora muestra el selector de dificultad
  const btnNueva = document.getElementById('btnNuevaSopa');
  if (btnNueva) {
    btnNueva.onclick = function() {
      if (modalDiv) {
        modalDiv.hidden = false;
        mostrarJuego(false);
      } else {
        reiniciarJuego();
        mostrarNivelDificultad(); // <-- Agrega esto aquí también
      }
    };
  }
});
