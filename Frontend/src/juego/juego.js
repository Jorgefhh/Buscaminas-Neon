//Este código contiene el modelo lógico y el renderizado del juego

// Constantes
const ORDENC = 8;
const ORDENF = 8;

// Estado del juego encapsulado en un objeto
const juego = {
  estado: "inicial", // "inicial", "jugando", "ganado", "perdido"
  tablero: [],
  celdas: [],
  contador: 0,
  minas: 10,
  minasRestantes: 10,
  intervalo: null,
  minutos: 0,
  segundos: 0,
  clicksIzquierdo: 0,
  clicksDerecho: 0,
  modoId: 1,
  fechaUltimaPartida: "-",
  expGanada: 0,
  
  // Métodos útiles
  haTerminado() {
    return this.estado === "ganado" || this.estado === "perdido";
  },
  haGanado() {
    return this.estado === "ganado";
  },
  haPerdido() {
    return this.estado === "perdido";
  },
  reiniciarEstado() {
    this.estado = "jugando";
    this.contador = 0;
    this.minutos = 0;
    this.segundos = 0;
    this.clicksIzquierdo = 0;
    this.clicksDerecho = 0;
    this.minasRestantes = this.minas;
    this.expGanada = 0;
    this.fechaUltimaPartida = "-";
    this.tablero = generarTablero(ORDENF, ORDENC, this.minas);
    this.actualizarEstadisticasUI();
    // Ocultar panel al reiniciar
    const panel = document.querySelector(".panel-estadisticas");
    if (panel) {
      panel.classList.remove("visible");
    }
  },
  actualizarEstadisticasUI() {
    const tiempoFormato = `${String(this.minutos).padStart(2, '0')}:${String(this.segundos).padStart(2, '0')}`;
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("tiempo", tiempoFormato);
    setText("estad-tiempo", tiempoFormato);
    setText("estad-clicks-izq", this.clicksIzquierdo);
    setText("estad-clicks-der", this.clicksDerecho);
    setText("estad-modo", this.modoId);
    setText("estad-fecha", this.fechaUltimaPartida);
    setText("estad-exp", this.expGanada);
    setText("bombas-restantes", this.minasRestantes);
    const panel = document.querySelector(".panel-estadisticas");
    if (panel) {
      panel.classList.toggle("visible", this.haTerminado());
    }
  }
};

// Inicializar tablero
juego.reiniciarEstado();

/*                   FLUJO PRINCIPAL DE CÓDIGO                */
//Ejecuto un oyente al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  pintar();
});


document.querySelector("#reiniciar").addEventListener("click", function () {
    this.classList.add("activado"); // enciende el borde
  reiniciarJuego(); // tu lógica original

  setTimeout(() => {
  document.querySelector("#reiniciar").classList.remove("activado");
}, 200); // se apaga después de un cuarto de segundo
});



/*---------------------     FUNCIONES DE RENDERIZADO    ----------------------- */

function pintar() {
    juego.celdas = [];
    //Apunto a la etiqueta que quiero cambiar:
    const cuadro = document.querySelector(".tablero");
    cuadro.innerHTML = "";
    //Voy creando divs con la clase asignada celda - oculta.
    for (let i = 0; i < ORDENC * ORDENF; i++) {
        const celda = document.createElement("div");
        celda.classList.add("celda", "celda-oculta"); //Imagen que se mostrara.
        //Le asigno un indice o posición 1D:
        celda.dataset.index = i;
        juego.celdas.push(celda); //Guardo la referencia del div creado en un conjunto de celdas.

        //AGREGO UN PUNTO OYENTE PARA QUE EL DIV i,j TENGA LA CAPACIDAD DE PERCIBIR EVENTOS.
        //EVENTOS CLICK IZQUIERDO:
        celda.addEventListener("click", (event_IZQ) => {
            if (juego.haTerminado()) return; // Evita que se siga jugando después de ganar o perder
            juego.clicksIzquierdo++; // Incrementar contador de clicks izquierdo
            juego.actualizarEstadisticasUI(); // Actualizar UI, 
            
            if(juego.minutos == 0 && juego.segundos == 0){
                iniciarTimer();
            }
            
            if (celda.classList.contains("celda-bandera")) {
                return; // Evita que se revele
            }
            event_IZQ.preventDefault();
            
            //Traducción de índices:
            let {fila_click, col_click} = getCoordenadas(event_IZQ);
            if (juego.tablero[fila_click][col_click] == "M") {
                celda.classList.add("celda-pulso");
                setTimeout(() => {
                celda.classList.remove("celda-pulso");
                }, 700);
            }   

            //EVENTO : LOOK AHEAD -> Click sobre un número
            if (juego.tablero[fila_click][col_click] > 0 &&  juego.tablero[fila_click][col_click] <= 9) {
            //SE ACTIVA
                resolveAdy(fila_click, col_click);
            }
            //ACTUALIZO TABLERO LÓGICO
            setBoard(fila_click, col_click);
            //POR ULTIMO PINTO EL TABLERO:
            mapeoDOM();

            //Verificación de fin de juego
            if (juego.contador == ORDENC * ORDENF - juego.minas) {
                detenerTimer();
                juego.estado = "ganado";
                juego.fechaUltimaPartida = new Date().toLocaleString();
                juego.expGanada = calcularExp(juego);
                juego.actualizarEstadisticasUI();
                setTimeout(() => {
                    alert("Ganaste");
                    // Enviar estadísticas al backend SOLO cuando gana
                    if (typeof enviarStats === 'function') {  //verifica que api.js fue cargada
                        enviarStats(1);    // esto envía finalmente el contenido a la función que armará el paquete post
                    }
                }, 50);
                return;
            }
            
            if (juego.haPerdido()) {
                detenerTimer();
                juego.fechaUltimaPartida = new Date().toLocaleString();
                juego.expGanada = calcularExp(juego); // o puedes dejar 0 para perdida
                juego.actualizarEstadisticasUI();
                setTimeout(() => {
                    alert("Has perdido >:(");
                    // NO enviar estadísticas cuando pierde
                }, 50);
                return;
            }
        });

    //EVENTOS: CLICK DERECHO
    celda.addEventListener("contextmenu", function (event_D) {
        event_D.preventDefault(); // Evita que se abra el menú del navegador
        if (juego.haTerminado()) return; // Evita que se siga jugando después de ganar o perder
        juego.clicksDerecho++; // Incrementar contador de clicks derecho
        
        let {fila_click, col_click } = getCoordenadas(event_D);
        // Si la celda ya tiene bandera, la quitamos
        if (celda.classList.contains("celda-bandera")) {
            celda.classList.remove("celda-bandera");
            celda.classList.add("celda-oculta");
            if (juego.minasRestantes < juego.minas) {
                juego.minasRestantes++;
            }
        } else {
            if (juego.tablero[fila_click][col_click] == "M" || juego.tablero[fila_click][col_click] == "V") {
                celda.classList.remove("celda-oculta");
                celda.classList.add("celda-bandera");
                if (juego.minasRestantes > 0) {
                    juego.minasRestantes--;
                }
            }
        }

        juego.actualizarEstadisticasUI(); // Actualizar UI
    });
    //Renderizado
    cuadro.appendChild(celda);
  }
  return juego.celdas;
}

// --------------------------   Funcion que asigna subclases a los divs dinámicos  --------------------------//
function mapeoDOM() {
  //Obtengo el indice
  for (let i = 0; i < ORDENC; i++) {
    for (let j = 0; j < ORDENC; j++) {
      const indice1D = i * ORDENC + j;  //Traduzco indices 2D a un único índice 1D
      const celda = juego.celdas[indice1D];
      const valor = juego.tablero[i][j];

    if(celda.classList.contains("celda-bandera") && (juego.tablero[i][j] >="1" && juego.tablero[i][j] <= "5" )){
        celda.classList.remove("celda-bandera");
    }
    if (juego.haPerdido()) {
        if (celda.classList.contains("celda-bandera") && juego.tablero[i][j] != "X") {
            //Renderizo las banderas con tonos rojo.
            celda.classList.remove("celda-bandera");
            celda.classList.add("celda-bandera-error");
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
}

function reiniciarJuego() {
  juego.reiniciarEstado();
  reiniciarTimer();
  pintar(); // repinta el DOM desde cero
}



function iniciarTimer() {
  if (juego.intervalo !== null) return;
  juego.intervalo = setInterval(() => {
    juego.segundos++;
    if (juego.segundos === 60) {
      juego.minutos++;
      juego.segundos = 0;
    }
    juego.actualizarEstadisticasUI();
  }, 1000);
}


function detenerTimer() {
  clearInterval(juego.intervalo);
}

function reiniciarTimer() {
  detenerTimer();
  juego.minutos = 0;
  juego.segundos = 0;
  document.getElementById("tiempo").textContent = "00:00";
  juego.intervalo = null;
}