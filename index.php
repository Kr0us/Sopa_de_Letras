<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sopa de Letras Pro</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  
  <header>
    <div id="mensaje" class="mt-4 display-6 text-success fw-bold"></div>
    <h1 class="titulo">Sopa de Letras</h1>
    <p class="subtitulo">Encuentra todas las palabras ocultas</p>
    <p id="nivelDificultad" class="fw-bold text-primary"></p>
  </header>
  
  <div class="container text-center mt-5">
    <div id="grid" class="grid my-4"></div>
    <h5 class="mb-3">Palabras a encontrar:</h5>
    <ul id="wordList" class="list-group list-group-flush mb-3"></ul>
    <button class="btn btn-success" id="btnNuevaSopa">Nueva Sopa</button>
  </div>

  <!-- Modal de selección de dificultad (sin Bootstrap) -->
  <div id="modalDificultad" class="modal-custom">
    <div class="modal-custom-dialog">
      <div class="modal-custom-content">
        <div class="modal-custom-header">
          <h5 class="modal-custom-title">Selecciona la dificultad</h5>
        </div>
        <div class="modal-custom-body">
          <label for="dificultad-modal" class="form-label">Tamaño de la sopa:</label>
          <select id="dificultad-modal" class="form-select">
            <option value="10" selected>Fácil (10x10)</option>
            <option value="14">Media (14x14)</option>
            <option value="18">Difícil (18x18)</option>
          </select>
        </div>
        <div class="modal-custom-footer">
          <button type="button" class="btn btn-primary" id="btnElegirDificultad">Comenzar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Felicitaciones -->
<div id="modalFelicidades" class="modal-custom" hidden>
  <div class="modal-custom-dialog">
    <div class="modal-custom-content text-center">
      <div class="modal-custom-header">
        <h5 class="modal-custom-title">¡Felicidades!</h5>
      </div>
      <div class="modal-custom-body">
        <p>¡Has completado la sopa de letras!</p>
        <label for="dificultad-felicidades" class="form-label mt-3">Selecciona la dificultad:</label>
        <select id="dificultad-felicidades" class="form-select mb-3">
          <option value="10">Fácil (10x10)</option>
          <option value="14">Media (14x14)</option>
          <option value="18">Difícil (18x18)</option>
        </select>
      </div>
      <div class="modal-custom-footer">
        <button id="btnVolverJugar" class="btn btn-success">Volver a jugar</button>
      </div>
    </div>
  </div>
</div>

  <footer class="footer-custom mt-5 py-3">
    <div class="container text-center">
      <span class="footer-text">Hecho por Renato Leal, Cristian Morales, Benjamín Muñoz, Martín Ovalle, Nicolás Toro &copy; <?php echo date('Y'); ?> | Sopa de Letras</span>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script> 
  <script src="script.js"></script>
</body>
</html>
