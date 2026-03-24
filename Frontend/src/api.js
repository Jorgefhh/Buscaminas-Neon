//En esta sección de código lo que voy a hacer es pasar los objetos a través
//del protocolo http para que un backend pueda procesarlos y hacer su respectiva lógica de negocio 

function enviarBackend() {
    // Verificar que el objeto juego esté disponible
    if (typeof juego === 'undefined') {
        console.error("Error: El objeto 'juego' no está disponible");
        return;
    }

    // Serializo el JSON
    const datosJson = JSON.stringify(juego);

    // Inicio la petición HTTP mediante un fetch
    fetch("http://localhost:8080/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: datosJson 
    })
    .then(res => res.json())  // Este es quien recibe el eventual HTTP response del servidor.
    .then(data => console.log("Respuesta del backend:", data))  // Procesa el objeto
    .catch(err => console.error("Error:", err)); // Captura el error si es que hubo
}

// Enviar solo los datos necesarios para la tabla Partidas
function enviarPartidaAlBackend(modoId = null) {
    if (typeof juego === 'undefined') {
        console.error("Error: El objeto 'juego' no está disponible");
        return;
    }

    // Construir el objeto partida
    const partida = {
        tiempo: (juego.minutos * 60 + juego.segundos).toFixed(2),
        click_izq: juego.clicksIzquierdo,
        click_der: juego.clicksDerecho,
        exp_ganada: calcularExp(juego), // o un valor fijo
        fecha_partida: new Date().toISOString(),
        Gamemode_idModo: modoId, // Solo si el usuario elige el modo explícitamente (el backend puede asignar un valor por defecto)
        Usuarios_idUsuarios: 1   // el id del usuario que jugó
    };

    fetch("http://localhost:8080/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partida)
    })
    .then(res => res.json())
    .then(data => console.log("Respuesta del backend:", data))
    .catch(err => console.error("Error:", err));
}

// Esta función la usé para enviar datos cuando el jugador GANA el juego
function enviarStats(modoId = 1) {
    if (typeof juego === 'undefined') {
        console.error("Error: El objeto 'juego' no está disponible");
        return;
    }
    if (juego.haGanado()) {
        enviarPartidaAlBackend(modoId);
    }
}

// Función para enviar datos manualmente (por ejemplo, con un botón)
function enviarDatosManualmente() {
    enviarBackend();
}


function calcularExp(juego) {
    // lógica simple: cada click suma 10 puntos
    return (juego.clicksIzquierdo + juego.clicksDerecho) * 10;
}