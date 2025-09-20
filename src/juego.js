//Este código contiene el modelo lógico y el renderizado del juego
//Definición de constantes básicas
//Dimensión del tablero
let juegoTerminado = false;
let contador = 0;
const ORDENC = 8;
const ORDENF = 8;
let minas = 10;
//Mundo lógico: una estructura de datos como una matriz
let tablero = generarTablero(ORDENF, ORDENC, minas);

console.log(tablero);

/*                   FLUJO PRINCIPAL DE CÓDIGO                */
//Ejecuto un oyente al cargar la página
window.addEventListener("DOMContentLoaded", () => {
pintar(tablero);
});

document.querySelector("#reiniciar").addEventListener("click", reiniciarJuego);


/*---------------------     FUNCIONES    ----------------------- */

//debería aleatoriamente crear la distribución de M y N.
//Barajar
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // índice entre 0 e i
    [array[i], array[j]] = [array[j], array[i]]; // intercambio
  }
  return array;
}

function crearSemillas(rango, minas) {
  //Entonces necesito crear un arreglo de 64 numeros y mezclarlo
  let mazo = [];
  for (let i = 0; i < rango; i++) {
    mazo.push(i);
  }
  //Debo barajar el arreglo usando el algoritmo suffle de fischer yates
  let semillas = shuffle(mazo).slice(0, minas);
  return semillas;
}
function generarTablero(filas, columnas, minas) {
  let rango = ORDENC * ORDENC; //Limite de coordenadas, conjunto experimental
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

function pintar(tablero) {
    const celdas = [];
    //Apunto a la etiqueta que quiero cambiar:
    const cuadro = document.querySelector(".tablero");
    cuadro.innerHTML = "";

    //Voy creando divs con la clase asignada celda - oculta.
    for (let i = 0; i < 64; i++) {
        const celda = document.createElement("div");
        celda.classList.add("celda", "celda-oculta"); //Imagen que se mostrara.
        //Le asigno un indice o posición 1D:
        celda.dataset.index = i;
        celdas.push(celda); //Guardo la referencia del div creado en un conjunto de celdas.

        //AGREGO UN PUNTO OYENTE PARA QUE EL DIV i,j TENGA LA CAPACIDAD DE PERCIBIR EVENTOS.
        //EVENTOS CLICK IZQUIERDO:
        celda.addEventListener("click", (e) => {
            if(juegoTerminado == true){
                alert("Juego terminado, perdiste pa.");
                return;
            }
            if (celda.classList.contains("celda-bandera")) {
                console.log("Esta celda está marcada con bandera. No se puede revelar.");
                return; // Evita que se revele
            }
            let idx = parseInt(e.target.dataset.index, 10); //e.target es el elemento que se le hizo un click
                                                      // Convierte el elemento que es una cadena a un numero de base 10 
            fila_click = Math.floor(idx / ORDENC);
            col_click = idx % ORDENC;

            if (tablero[fila_click][col_click] == "M") {
                celda.classList.add("celda-pulso");
                setTimeout(() => {
                celda.classList.remove("celda-pulso");
                }, 700);
            }   

            //EVENTO : LOOK AHEAD -> Click sobre un número
            if (tablero[fila_click][col_click] > 0 &&  tablero[fila_click][col_click] <= 9) {
            //SE ACTIVA
                resolveAdy(tablero, fila_click, col_click, celdas);
            }
            //ACTUALIZO TABLERO LÓGICO
            setBoard(tablero, fila_click, col_click);
            //console.log(tablero);
            //console.log(`Click en fila ${fila_click}, columna ${col_click}`);
            //POR ULTIMO PINTO EL TABLERO:
            mapeoDOM(celdas, tablero);

            //Antes del renderizado: Verificación de partida ganada.
            if (contador == ORDENC * ORDENC - minas) {
                setTimeout(() => {
                    alert("Ganaste");
                }, 50);
            }
        });

    //EVENTOS: CLICK DERECHO
    celda.addEventListener("contextmenu", function (event) {
        let idx = parseInt(event.target.dataset.index, 10);
        fila_click = Math.floor(idx / ORDENC);
        col_click = idx % ORDENC;
        event.preventDefault(); // Evita que se abra el menú del navegador
        // Si la celda ya tiene bandera, la quitamos
        if (celda.classList.contains("celda-bandera")) {
            celda.classList.remove("celda-bandera");
            celda.classList.add("celda-oculta");
        } else {
            if(tablero[fila_click][col_click] == "M" || tablero[fila_click][col_click] == "V"){
                celda.classList.remove("celda-oculta");
                celda.classList.add("celda-bandera");
            }
        }
    });
    //Renderizado
    cuadro.appendChild(celda);
  }
  console.log("Generando tablero...");
  return celdas;
}

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
    //alert("Perdiste pa");
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

function mapeoDOM(celdas, tablero) {
  //Obtengo el indice
  for (let i = 0; i < ORDENC; i++) {
    for (let j = 0; j < ORDENC; j++) {
      const indice1D = i * ORDENC + j;  //Traduzco indices 2D a un único índice 1D
      const celda = celdas[indice1D];
      const valor = tablero[i][j];

      celda.classList.remove("celda-oculta","celda-1","celda-2","celda-3","celda-4","celda-mina","celda-vacia");

      //Pongo la clase según el estado del tablero lógico:
      switch(valor){
        case '1': celda.classList.add("celda","celda-1"); break;
        case '2': celda.classList.add("celda","celda-2"); break;
        case '3': celda.classList.add("celda","celda-3"); break;
        case '4': celda.classList.add("celda","celda-4"); break;
        case 'X': celda.classList.add("celda","celda-mina"); break;
        case 'B': celda.classList.add("celda","celda-vacia"); break;
        default: celda.classList.add("celda","celda-oculta"); break;
      }
    }
  }
}


function reiniciarJuego() {
  juegoTerminado = false;
  contador = 0;
  tablero = generarTablero(ORDENC,ORDENC,minas); // lógica que crea el tablero vacío o con minas
  pintar(tablero); // repinta el DOM desde cero
  document.querySelector(".mensaje").textContent = ""; // limpia mensajes
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
  let cont = 0;
  direcciones.forEach(([df, dc]) => {  //Recorro todas las diagonales:
    let nueva_fila = fila + df;
    let nueva_col = col + dc;
    //Si el numero es valido: Creo el indice
    if (nueva_fila >= 0 && nueva_fila < ORDENF && nueva_col >= 0 && nueva_col < ORDENF) {
      let idx = ORDENC * nueva_fila + nueva_col;
      //Validación de bordes:
      if (tablero[nueva_fila][nueva_col] == "M" && celdas[idx].classList.contains("celda-bandera")) {
        cont++;
        console.log("Cantidad de banderas bien colocadas: " + cont);
      }
    }

  });
  if(cont == tablero[fila][col]){
    //Realiza el revelado de todas las   celdas que no son minas. 
    direcciones.forEach(([df,dc]) => {
        let nueva_fila = fila + df;
        let nueva_col = col + dc;
        if (!(nueva_fila >= 0 && nueva_fila < ORDENF) || !(nueva_col >= 0 && nueva_col < ORDENF)) {
          //Si me salgo de los límites
          //alert("La posicion seleccionada no es correcta.");
          return;
        }
        
        if(tablero[nueva_fila][nueva_col] != "M" ){
            setBoard(tablero, nueva_fila, nueva_col);
        }
    });
  }
}