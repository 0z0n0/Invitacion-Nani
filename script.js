// ==========================================================================
// CONFIGURACIÓN PRINCIPAL
// ==========================================================================
// Pega aquí la URL que obtuviste al publicar el Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbxUVHz7Ct29cg06sn_alZupJbCIEPUV8RziZ5XULT2O0EU8ZlXiZzIwEUCVKEaEViVmGA/exec';

// Fecha del evento: 10 de Abril de 2027, 21:00 hs
const fechaEvento = new Date("April 10, 2027 21:00:00").getTime();
// Fecha límite de RSVP: 10 de Febrero de 2027, 23:59 hs
const fechaLimiteRSVP = new Date("February 10, 2027 23:59:59").getTime();

// ==========================================================================
// 1. LÓGICA DE LA CUENTA REGRESIVA
// ==========================================================================
const actualizarReloj = setInterval(function() {
    const ahora = new Date().getTime();
    const distancia = fechaEvento - ahora;

    if (distancia < 0) {
        clearInterval(actualizarReloj);
        document.getElementById("reloj").innerHTML = "¡Llegó el día!";
        return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Añadir ceros a la izquierda si es menor a 10
    document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
    document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
    document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
    document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');
}, 1000);

// ==========================================================================
// 2. VALIDACIÓN DE FECHA LÍMITE RSVP
// ==========================================================================
function chequearFechaLimite() {
    const ahora = new Date().getTime();
    if (ahora > fechaLimiteRSVP) {
        const btnRSVP = document.getElementById('btn-rsvp');
        btnRSVP.disabled = true;
        btnRSVP.style.backgroundColor = '#555'; // Estilo apagado
        btnRSVP.innerText = 'Fecha límite alcanzada';
        
        const inputs = document.querySelectorAll('#form-rsvp input, #form-rsvp select');
        inputs.forEach(input => input.disabled = true);
    }
}
chequearFechaLimite();

// ==========================================================================
// 3. ENVÍO DE FORMULARIOS A GOOGLE SHEETS
// ==========================================================================

// Enviar sugerencia de canción
document.getElementById('form-canciones').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue
    
    const btn = e.target.querySelector('button');
    const msg = document.getElementById('msg-canciones');
    const nombre = document.getElementById('cancion-nombre').value;
    const cancion = document.getElementById('cancion-tema').value;

    btn.innerText = 'Enviando...';
    btn.disabled = true;

    const data = {
        formType: 'canciones',
        nombre: nombre,
        cancion: cancion
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        msg.style.color = '#80EF80'; // Pastel green
        msg.innerText = '¡Canción sugerida con éxito!';
        e.target.reset();
        btn.innerText = 'Sugerir otra';
        btn.disabled = false;
    })
    .catch(error => {
        msg.style.color = '#DCA1A1'; // Dusty rose
        msg.innerText = 'Hubo un error. Intenta nuevamente.';
        btn.innerText = 'Sugerir Canción';
        btn.disabled = false;
    });
});

// Enviar confirmación de asistencia (RSVP)
document.getElementById('form-rsvp').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btn-rsvp');
    const msg = document.getElementById('msg-rsvp');
    const nombre = document.getElementById('rsvp-nombre').value;
    const asiste = document.getElementById('rsvp-asiste').value;
    const menu = document.getElementById('rsvp-menu').value || 'Ninguno';

    btn.innerText = 'Confirmando...';
    btn.disabled = true;

    const data = {
        formType: 'rsvp',
        nombre: nombre,
        asiste: asiste,
        menu: menu
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        msg.style.color = '#80EF80';
        msg.innerText = '¡Gracias por confirmar!';
        e.target.reset();
        btn.innerText = 'Confirmado';
        // Lo dejamos deshabilitado para evitar envíos duplicados por error
    })
    .catch(error => {
        msg.style.color = '#DCA1A1';
        msg.innerText = 'Hubo un error de conexión. Intenta más tarde.';
        btn.innerText = 'Confirmar';
        btn.disabled = false;
    });
});

// ==========================================================================
// 4. CARRUSEL DE FOTOS (loop infinito con clones)
// ==========================================================================
(function() {
    const track = document.getElementById('carrusel-track');
    const dotsContainer = document.getElementById('carrusel-dots');

    if (!track || !dotsContainer) return;

    // Slides originales (antes de insertar clones)
    const slidesOriginales = Array.from(track.querySelectorAll('.carrusel-slide'));
    const total = slidesOriginales.length;

    // Insertar clon de la última slide al inicio y clon de la primera al final
    const clonPrimero = slidesOriginales[0].cloneNode(true);
    const clonUltimo = slidesOriginales[total - 1].cloneNode(true);
    track.insertBefore(clonUltimo, track.firstChild);
    track.appendChild(clonPrimero);

    // Ahora el track tiene total + 2 slides: [clon-último, 1, 2, ..., N, clon-primero]
    // El índice real dentro del track: posición 0 = clon-último, posición 1..N = reales, posición N+1 = clon-primero
    let posTrack = 1; // Empezamos en la primera real (posición 1)
    let indiceReal = 0; // Índice lógico 0-based para los dots
    let autoplayTimer = null;
    let enTransicion = false;

    // Posicionar sin animación al inicio
    setTransicion(false);
    moverA(posTrack);

    // Crear dots para las slides reales
    slidesOriginales.forEach(function(_, i) {
        const dot = document.createElement('button');
        dot.className = 'carrusel-dot' + (i === 0 ? ' activo' : '');
        dot.setAttribute('aria-label', 'Ir a foto ' + (i + 1));
        dot.addEventListener('click', function() { irAReal(i); });
        dotsContainer.appendChild(dot);
    });

    function setTransicion(activa) {
        track.style.transition = activa ? 'transform 0.45s ease' : 'none';
    }

    function moverA(pos) {
        track.style.transform = 'translateX(-' + (pos * 100) + '%)';
    }

    function actualizarDots() {
        dotsContainer.querySelectorAll('.carrusel-dot').forEach(function(dot, i) {
            dot.classList.toggle('activo', i === indiceReal);
        });
    }

    // Navegar a un índice real (0-based), animado
    function irAReal(indice) {
        if (enTransicion) return;
        indiceReal = indice;
        posTrack = indice + 1; // +1 por el clon al inicio
        setTransicion(true);
        enTransicion = true;
        moverA(posTrack);
        actualizarDots();
        reiniciarAutoplay();
    }

    function siguiente() {
        if (enTransicion) return;
        posTrack++;
        indiceReal = (indiceReal + 1) % total;
        setTransicion(true);
        enTransicion = true;
        moverA(posTrack);
        actualizarDots();
        reiniciarAutoplay();
    }

    function anterior() {
        if (enTransicion) return;
        posTrack--;
        indiceReal = (indiceReal - 1 + total) % total;
        setTransicion(true);
        enTransicion = true;
        moverA(posTrack);
        actualizarDots();
        reiniciarAutoplay();
    }

    // Al terminar la transición, hacer el salto silencioso si estamos en un clon
    track.addEventListener('transitionend', function() {
        enTransicion = false;
        // Llegamos al clon de la primera (posición total + 1) → saltar a la real primera (posición 1)
        if (posTrack === total + 1) {
            setTransicion(false);
            posTrack = 1;
            moverA(posTrack);
        }
        // Llegamos al clon de la última (posición 0) → saltar a la real última (posición total)
        if (posTrack === 0) {
            setTransicion(false);
            posTrack = total;
            moverA(posTrack);
        }
    });

    function reiniciarAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(siguiente, 4000);
    }

    document.querySelector('.carrusel-prev').addEventListener('click', anterior);
    document.querySelector('.carrusel-next').addEventListener('click', siguiente);

    // Soporte swipe táctil
    let touchStartX = 0;
    track.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? siguiente() : anterior(); }
    }, { passive: true });

    reiniciarAutoplay();
})();
