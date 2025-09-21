// ------------------------     FUNCIONES DE LÓGICA Y ALGORITMOS        ---------------------------//

function generarTablero(filas, columnas, minas) {
  let rango = ORDENF * ORDENC; //Limite de coordenadas, conjunto experimental
  //Mundo lógico: Necesito una estructura de datos como una matriz
  const matriz = [];
  //JS NO CONTIENE MATRICES ASÍ QUE LAS CREAMOS A MANO:
  //Voy creando las filas
  for (let i = 0; i < filas; i++) {
    let fila = [];
    for (let j = 0; j < columnas; j++) {
      fila.push("V"); // llenamos cada celda con "V"
    }
    matriz.push(fila);
  }
  //Ahora creo numeros aleatorios del 0 al 63
  //PARA EL MODO FÁCIL SON 10 MINAS => GENERO UNA LISTA DE 10 NUMEROS ALEATORIOS SIN REPOSICIÓN
  let seed = crearSemillas(rango, minas);
  //Transformo cada semilla en una coordenada fila i , columna j:
  for (let i = 0; i < seed.length; i++) {
    let valor = seed[i];
    let fila = Math.floor(valor / ORDENC);
    let col = valor % ORDENC;
    //Ahora lo establezco en el arreglo lógico:
    matriz[fila][col] = "M";
  }
  //obtengo una matriz finalmente que representa un tablero de juego
  return matriz;
}

function crearSemillas(rango, minas) {
  //Primero se crea un arreglo de 64 numeros y mezclarlo
  let mazo = [];
  for (let i = 0; i < rango; i++) {
    mazo.push(i);
  }
  //Debo barajar el arreglo usando el algoritmo suffle de fischer yates
  let semillas = shuffle(mazo).slice(0, minas);
  return semillas;
}
//Esta función tiene la tarea de barajar un arreglo de 64 numeros para aleatorizarlos.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // índice entre 0 e i
    [array[i], array[j]] = [array[j], array[i]]; // intercambio
  }
  return array;
}


// ------------------       LÓGICA PRINCIPAL DEL JUEGO      ----------------------//
function setBoard(tablero, fila, col) {
  //Ambos son filas
  //Uso las constantes anteriores.
  if (!(fila >= 0 && fila < ORDENF) || !(col >= 0 && col < ORDENF)) {
    //Si me salgo de los límites
    //alert("La posicion seleccionada no es correcta.");
    return;
  }
  //Escenario: CLICK EN MINA => PIERDE
  if (tablero[fila][col] == "M") {
    for(let i = 0; i < ORDENC; i++){
        for(let j = 0; j < ORDENC; j++){
            if(tablero[i][j] == "M"){
                tablero[i][j] = "X";
            }
        }
    }
    juegoTerminado = true;
    return;
  }
  if (tablero[fila][col] != "V") return; // ya revelada, corto

  
  //A PARTIR DE AQUÍ SOLO QUEDAN CELDAS 'V' NO REVELADAS QUE NO TIENEN MINAS
  contador++;
  console.log("Celdas acertadas: " + contador);

  let minasAdy = adyacencia(tablero, fila, col);

  if (minasAdy > 0) {
    //Ponemos lógicamente en el tablero el numero correspondiente:
    tablero[fila][col] = minasAdy + "";
    return;
  } else {
    tablero[fila][col] = "B";

    //PROPAGO RECURSIVAMENTE HACIA TODOS SUS LADOS ADYACENTES:

    //Primero defino los movimientos adyacentes posibles:
    const direcciones = [
      [-1, -1],[-1, 0], [-1, 1], // fila de arriba
      [0, -1],          [0, 1], // misma fila
      [1, -1],  [1, 0],  [1, 1], // fila de abajo
    ];

    //Mediante el for each hago 8 llamadas recursivas:
    direcciones.forEach(([df, dc]) => {
      setBoard(tablero, fila + df, col + dc);
    });
  }

  return;
}


function adyacencia(tablero, fila, col) {
  const direcciones = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // fila de arriba
    [0, -1],
    [0, 1], // misma fila
    [1, -1],
    [1, 0],
    [1, 1], // fila de abajo
  ];
  let cont = 0;
  direcciones.forEach(([df, dc]) => {
    let nueva_fila = fila + df;
    let nueva_col = col + dc;
    //Validación de bordes:
    if ( nueva_fila >= 0 && nueva_fila < tablero.length && nueva_col >= 0 && nueva_col < tablero.length) {
      //Busco si hay minas alrededor:
      if (tablero[nueva_fila][nueva_col] === "M") {
        cont++;
      }
    }
  });
  return cont;
}


function resolveAdy(tablero, fila, col,celdas){
    //Se fija en cada celda adyacente para ver la cantidad de banderas
    const direcciones = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // fila de arriba
    [0, -1],
    [0, 1], // misma fila
    [1, -1],
    [1, 0],
    [1, 1], // fila de abajo
  ];
  let totalFlag = 0, flagsValid = 0;
  direcciones.forEach(([df, dc]) => {  //Recorro todas las diagonales:
    let nueva_fila = fila + df;
    let nueva_col = col + dc;
    //Si el numero es valido: Creo el indice
    if (nueva_fila >= 0 && nueva_fila < ORDENF && nueva_col >= 0 && nueva_col < ORDENF) {
      let idx = ORDENC * nueva_fila + nueva_col;
      //Validación de bordes:
      if(celdas[idx].classList.contains("celda-bandera")){
        totalFlag++;
        console.log("Cantidad de banderas en total: " + totalFlag);
        if(tablero[nueva_fila][nueva_col] == "M")  {
            flagsValid++;
            console.log("Cantidad de banderas bien colocadas: " + flagsValid);
        }
      }
    }

  });
  
  if(totalFlag != tablero[fila][col]){
    //Se considera un escenario de look-ahead inválido, por lo tanto no es castigable a revelar celdas.
    //Mejora a futuro: Animación de celda oculta a celda vacia, para todas las celdas que no sean banderas.
    // mientras el usuario presiona click.
    console.log("Acorde Insuficiente o Excedente => No revelo");
    return;
  }
  let jugadaValida = false;
  if (flagsValid == tablero[fila][col]) {
    console.log("Jugada valida");
    jugadaValida = true;
  }
    //Realiza el revelado de todas las casillas adyacentes indistintamente.
    direcciones.forEach(([df,dc]) => {
        let nueva_fila = fila + df;
        let nueva_col = col + dc;
        if (!(nueva_fila >= 0 && nueva_fila < ORDENF) || !(nueva_col >= 0 && nueva_col < ORDENF)) {
          //Si me salgo de los límites
          //alert("La posicion seleccionada no es correcta.");
          return;
        }
        if(jugadaValida){
            if(tablero[nueva_fila][nueva_col] != "M"){
                setBoard(tablero, nueva_fila, nueva_col);
                //Se evita revelar celdas de mina en caso de hacer una colocación de banderas válida.
            }
            return;
        }
        

        if(tablero[nueva_fila][nueva_col] == "M"){
            //Flujo de jugada no valida.
            console.log("Flujo de jugada no valida.");
            setBoard(tablero, nueva_fila, nueva_col);
        }
    });
  }


function getCoordenadas(event){
    // Convierte el elemento que es una cadena a un numero de base 
    let idx = parseInt(event.target.dataset.index, 10);  //e.target es el elemento que se le hizo un click
    //Traducción de índice 1D a 2D
    let col_click = idx % ORDENC;
    let fila_click = Math.floor(idx / ORDENC);
    return {fila_click, col_click};
} 