

//Busca todos los elmeneos que tengan la clase diff-card

const difficultyCards = Array.from(document.querySelectorAll('.diff-card'));  //Devuelve una colección 
const startButton = document.getElementById('start-button');
//Guarda la referencia a un elemento del DOM de html 
const guestLogin = document.getElementById('guest-login');
//Guarda una referencia al elemento que contiene:
//Avatar,  Username, XP y Barra de XP
const accountPreview = document.getElementById('account-preview');
const username = document.getElementById('username');
const xpValue = document.getElementById('xp-value');
const xpProgress = document.getElementById('xp-progress');
let selectedDifficulty = 0;  //Hardcodeo la dificultad deseada por ahora


//Verifica la existencia de un token para saber si hay sesión
const hasSession = Boolean(localStorage.getItem('token'));

//Utilizamos la propiedad hiden para ocultar un elemento HTML
/*
Básicamente le ponemos así, con eso el navegador no lo mostrará:
<a hidden>Iniciá sesión</a>
*/
guestLogin.hidden = hasSession;
accountPreview.hidden = !hasSession;   //Si hay sesión entonces la propiedad de ocultar es falsa

if (hasSession) {
//ESTA ES UNA OPERACIÓN PARA DESEARIZAR
//IMPORTANTE: Convierte el string JSON de vuelta en un objeto JavaScript.
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const nombre = usuario.nombreUsuarios;

  //Usamos la operación de javascript nullish coalescing "??":
  const experiencia = Number(usuario.experiencia ?? 0);
  //La linea de arriba básicamente dice:
  //Si el usuario tiene un valor de xp, usalo, si es null entonces usa 0

  //Si el usuario tiene nombre pues poner ese nombre en html
  if (nombre) username.textContent = nombre;
  xpValue.textContent = experiencia;
  //Calcular la experiencia
  xpProgress.style.width = `${Math.min(experiencia, 100)}%`;
}

function selectDifficulty(index) {
  selectedDifficulty = index;
  difficultyCards.forEach((card, cardIndex) => {
    const isSelected = cardIndex === index;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-pressed', String(isSelected));
  });
}

difficultyCards.forEach((card) => card.addEventListener('click', () => selectDifficulty(Number(card.dataset.index))));
startButton.addEventListener('click', () => {
  if (selectedDifficulty === 0) window.location.href = '../juego/panel_tablero.html';
});