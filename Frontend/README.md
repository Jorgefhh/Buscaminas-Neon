# Cómo organizar las carpetas

La idea es simple: **una carpeta por tema**. Todo lo de login/registro va junto,
todo lo del juego va junto, y lo que usan los dos (api.js, styles.css) queda
"suelto" en `src/` porque es compartido.

```
Frontend/
├── assets/                  <- imágenes, iconos, etc (ya la tenías)
├── src/
│   ├── api.js                <- TODOS los fetch al backend (login, register, juego...)
│   ├── styles.css            <- colores y estilos base, compartidos por toda la app
│   │
│   ├── auth/                 <- NUEVA carpeta: todo lo de login/registro
│   │   ├── login.html
│   │   ├── registrar.html
│   │   ├── auth.css
│   │   └── auth.js
│   │
│   └── juego/                <- acá van tus archivos que ya tenías
│       ├── panel_tablero.html
│       ├── juego.js
│       └── logica.js
│
└── README.md
```

## Por qué separarlo así

- **`auth/`**: agrupa TODO lo del login y registro. Si mañana agregás
  "olvidé mi contraseña", va ahí adentro también.
- **`juego/`**: agrupa lo que ya tenías. No tuve que tocar tu lógica del juego,
  solo la muevo de carpeta.
- **`api.js` y `styles.css` quedan sueltos en `src/`** porque los usan
  las dos partes (login y juego). Si los metiera dentro de `auth/`, el
  juego no podría usarlos sin repetir código.

## Cómo se conecta cada página

1. El usuario entra a `src/auth/login.html`.
2. Si no tiene cuenta, aprieta "Registrate acá" → `registrar.html`.
3. En `registrar.html` completa el formulario → `auth.js` llama a
   `registrarUsuario()` (que está en `api.js`) → hace `POST /usuario/register`.
4. Si sale bien, lo manda de vuelta a `login.html`.
5. En `login.html` completa sus datos → `auth.js` llama a `loginUsuario()`
   → `POST /usuario/login` → el backend devuelve el token.
6. Guardamos el token con `localStorage.setItem("token", ...)`.
7. Lo mandamos a `src/juego/panel_tablero.html` (tu dashboard/juego).

## Qué falta que hagas vos

1. Mover `juego.js`, `logica.js` y `panel_tablero.html` a `src/juego/`
   (leé `src/juego/LEEME_MOVER_ACA.txt`).
2. Revisar `src/api.js` y cambiar `API_BASE_URL` si tu backend no corre
   en `http://localhost:8080`.
3. Fijarte que los nombres de los campos que mando (`correo`, `contrasena`,
   `nombre`) coincidan con lo que tu backend espera en el JSON. Si tu backend
   usa otros nombres (por ejemplo `email` en vez de `correo`), cambialos en
   `auth.js` y en los `id` de los `<input>` del HTML.
4. Para probarlo sin instalar nada, podés abrir `login.html` con la
   extensión "Live Server" de VSCode (clic derecho → "Open with Live Server").
   Abrirlo con doble clic directo también funciona, pero Live Server evita
   algunos problemas raros del navegador.

## Sobre el diseño

Usé un modo oscuro con cajas de borde fino, como el panel de tu imagen
(la de la banderita 🚩, "Reiniciar" y el reloj). Arriba de cada página de
login/registro dejé una franja con 3 cajitas del mismo estilo, para que
se sienta parte del mismo "juego" en vez de una pantalla de login genérica.
Los colores y tipografías están todos como variables al principio de
`styles.css`, así que si querés cambiar el rojo por otro color, lo cambiás
en un solo lugar (`--color-acento`) y se actualiza en toda la app.
