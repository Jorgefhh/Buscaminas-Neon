//Este código contiene el modelo lógico y el renderizado del juego
let segundos = 0;
let minutos = 0;
let intervalo = null;
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


document.querySelector("#reiniciar").addEventListener("click", function () {
    this.classList.add("activado"); // enciende el borde
  reiniciarJuego(); // tu lógica original

  setTimeout(() => {
  document.querySelector("#reiniciar").classList.remove("activado");
}, 200); // se apaga después de un cuarto de segundo
});



/*---------------------     FUNCIONES DE RENDERIZADO    ----------------------- */

function pintar(tablero) {
    const celdas = [];
    //Apunto a la etiqueta que quiero cambiar:
    const cuadro = document.querySelector(".tablero");
    cuadro.innerHTML = "";
    //Voy creando divs con la clase asignada celda - oculta.
    for (let i = 0; i < ORDENC * ORDENF; i++) {
        const celda = document.createElement("div");
        celda.classList.add("celda", "celda-oculta"); //Imagen que se mostrara.
        //Le asigno un indice o posición 1D:
        celda.dataset.index = i;
        celdas.push(celda); //Guardo la referencia del div creado en un conjunto de celdas.

        //AGREGO UN PUNTO OYENTE PARA QUE EL DIV i,j TENGA LA CAPACIDAD DE PERCIBIR EVENTOS.
        //EVENTOS CLICK IZQUIERDO:
        celda.addEventListener("click", (event_IZQ) => {
            if (juegoTerminado) return; // Evita que se siga jugando después de ganar o perder
            if(minutos == 0 && segundos == 0){
                console.log("arranca");
                iniciarTimer();
            }
            
            if (celda.classList.contains("celda-bandera")) {
                console.log("Esta celda está marcada con bandera. No se puede revelar.");
                return; // Evita que se revele
            }
            event_IZQ.preventDefault();
            
            //Traducción de índices:
            let {fila_click, col_click} = getCoordenadas(event_IZQ);
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
                detenerTimer();
                juegoTerminado = true;
                setTimeout(() => {
                    alert("Ganaste");
                }, 50);
                return;
            }
        });

    //EVENTOS: CLICK DERECHO
    celda.addEventListener("contextmenu", function (event_D) {
        event_D.preventDefault(); // Evita que se abra el menú del navegador
        if (juegoTerminado) return; // Evita que se siga jugando después de ganar o perder
        let {fila_click, col_click } = getCoordenadas(event_D);
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
  console.log(tablero);
  return celdas;
}


// --------------------------   Funcion que asigna subclases a los divs dinámicos  --------------------------//
function mapeoDOM(celdas, tablero) {
  //Obtengo el indice
  for (let i = 0; i < ORDENC; i++) {
    for (let j = 0; j < ORDENC; j++) {
      const indice1D = i * ORDENC + j;  //Traduzco indices 2D a un único índice 1D
      const celda = celdas[indice1D];
      const valor = tablero[i][j];

    if(celda.classList.contains("celda-bandera") && (tablero[i][j] >="1" && tablero[i][j] <= "5" )){
        celda.classList.remove("celda-bandera");
    }
    if (juegoTerminado) {
        if (celda.classList.contains("celda-bandera") && tablero[i][j] != "X") {
            //Renderizo las banderas con tonos rojo.
            celda.classList.remove("celda-bandera");
            celda.classList.add("celda-bandera-error");
            console.log("Celda encontrada roja")
        }
    }
      celda.classList.remove("celda-oculta","celda-1","celda-2","celda-3","celda-4","celda-5","celda-mina","celda-vacia");

      
      //Pongo la clase según el estado del tablero lógico:
      switch(valor){
        case '1': celda.classList.add("celda","celda-1"); break;
        case '2': celda.classList.add("celda","celda-2"); break;
        case '3': celda.classList.add("celda","celda-3"); break;
        case '4': celda.classList.add("celda","celda-4"); break;
        case '5': celda.classList.add("celda","celda-5"); break;
        case 'X': celda.classList.add("celda","celda-mina"); break;
        case 'B': celda.classList.add("celda","celda-vacia"); break;
        default: celda.classList.add("celda","celda-oculta"); break;
      }
    }
  }
  if (juegoTerminado == true) {
    //terminar timer:
    detenerTimer();

    setTimeout(() => {
      alert("Has perdido ;(");
    }, 50);
    return;
  }
}

function reiniciarJuego() {
  juegoTerminado = false;
  contador = 0;
  tablero = generarTablero(ORDENC,ORDENC,minas); // lógica que crea el tablero vacío o con minas
  reiniciarTimer();
  pintar(tablero); // repinta el DOM desde cero
  
  
  //document.querySelector(".mensaje").textContent = ""; // limpia mensajes, en caso de existir etiquetas html
}



function iniciarTimer() {
  if (intervalo !== null) return;
  intervalo = setInterval(() => {
    segundos++;
    if (segundos === 60) {
      minutos++;
      segundos = 0;
    }
    document.getElementById("tiempo").textContent =
      `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }, 1000);
}


function detenerTimer() {
  clearInterval(intervalo);
}

function reiniciarTimer() {
  detenerTimer();
  segundos = 0;
  minutos = 0;
  document.getElementById("tiempo").textContent = "00:00";
  intervalo = null; // 
}