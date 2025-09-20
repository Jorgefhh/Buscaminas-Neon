function propagation(tablero, click) { //Ambos son filas
    let fila = click[1];
    let columna = click[0];
    //Uso las constantes anteriores.
    if (fila >= 0 && fila <= ORDENF || columna >= 0 && columna <= ORDENF) { //Si me salgo de los límites
        alert("La posicion seleccionada no es correcta.");
    }
    if (tablero){

    }
}
