// ==========================================================================
// 0. INTRO: VIDEO DE APERTURA
// ==========================================================================
(function () {
    const introScreen = document.getElementById('intro-screen');
    const introVideo  = document.getElementById('intro-video');

    if (!introScreen || !introVideo) return;

    // Bloquear scroll mientras dura la intro
    document.body.style.overflow = 'hidden';

    function terminarIntro() {
        introScreen.classList.add('fade-out');
        document.body.style.overflow = '';
        // Eliminar el nodo del DOM al terminar el fade
        introScreen.addEventListener('transitionend', function () {
            introScreen.remove();
        }, { once: true });
    }

    // Caso 1: el video termina normalmente
    introVideo.addEventListener('ended', terminarIntro);

    // Caso 2: el video no pudo cargarse / reproducirse (fallback: 8 s)
    introVideo.addEventListener('error', function () {
        setTimeout(terminarIntro, 500);
    });

    // Caso 3: timeout de seguridad por si el evento 'ended' no llega
    introVideo.addEventListener('loadedmetadata', function () {
        var duracion = introVideo.duration;
        if (isFinite(duracion) && duracion > 0) {
            setTimeout(terminarIntro, (duracion + 1) * 1000);
        }
    });
})();


// ==========================================================================
// 1. SISTEMA DE IDIOMAS (i18n)
// ==========================================================================
const traducciones = {
    es: {
        countdown_title:  'Falta muy poco...',
        dias:             'Días',
        horas:            'Hs',
        minutos:          'Min',
        segundos:         'Seg',
        rsvp_title:       'Confirmar Asistencia',
        rsvp_deadline:    'Por favor, confirmá antes del 10/02/2027',
        rsvp_nombre_ph:   'Nombre y Apellido',
        rsvp_asiste_label:'¿Asistís?',
        rsvp_si:          'Sí, confirmo',
        rsvp_no:          'No podré asistir',
        rsvp_menu_ph:     "Menú especial (Celíaco, Vegano, etc.) o 'Ninguno'",
        rsvp_btn:         'Confirmar',
        fiesta_title:     'La Fiesta',
        fiesta_fecha_label:'Fecha:',
        fiesta_fecha_val: 'Sábado 10 de Abril de 2027',
        fiesta_hora_label:'Horario:',
        fiesta_hora_val:  '21:00 hs a 04:00 hs',
        fiesta_lugar_label:'Lugar:',
        fiesta_lugar_val: 'El Campito del Abuelo, Ibarlucea, Santa Fe',
        fiesta_mapa:      'Ver en Google Maps',
        dress_title:      'Dress Code',
        dress_ellas:      'Ellas: Vestido.',
        dress_ellos:      'Ellos: Camisa y pantalón.',
        dress_prohibidos: 'Colores Prohibidos: Bordo, Rosa, Dorado.',
        regalos_title:    'Regalos',
        regalos_texto:    'Tu presencia es mi mejor regalo, pero si deseas colaborar:',
        musica_title:     'Música',
        musica_texto:     '¿Qué canción no puede faltar?',
        musica_nombre_ph: 'Tu Nombre',
        musica_tema_ph:   'Canción y Artista',
        musica_btn:       'Sugerir Canción',
        momentos_title:   'Momentos',
        footer_texto:     '¡Te espero para celebrar juntos!',
        // mensajes dinámicos de formularios
        msg_rsvp_ok:      '¡Gracias por confirmar!',
        msg_rsvp_error:   'Hubo un error de conexión. Intenta más tarde.',
        msg_rsvp_limite:  'Fecha límite alcanzada',
        msg_cancion_ok:   '¡Canción sugerida con éxito!',
        msg_cancion_error:'Hubo un error. Intenta nuevamente.',
        btn_enviando:     'Enviando...',
        btn_confirmando:  'Confirmando...',
        btn_confirmado:   'Confirmado',
        btn_sugerir_otra: 'Sugerir otra',
    },
    pt: {
        countdown_title:  'Falta muito pouco...',
        dias:             'Dias',
        horas:            'Hrs',
        minutos:          'Min',
        segundos:         'Seg',
        rsvp_title:       'Confirmar Presença',
        rsvp_deadline:    'Por favor, confirme até de 10/02/2027',
        rsvp_nombre_ph:   'Nome completo',
        rsvp_asiste_label:'Você vai?',
        rsvp_si:          'Sim, eu vou',
        rsvp_no:          'Não poderei ir',
        rsvp_menu_ph:     "Menu especial (Celíaco, Vegano, etc.) ou 'Nenhum'",
        rsvp_btn:         'Confirmar',
        fiesta_title:     'A Festa',
        fiesta_fecha_label:'Data:',
        fiesta_fecha_val: 'Sábado, 10 de Abril de 2027',
        fiesta_hora_label:'Horário:',
        fiesta_hora_val:  '21:00h às 04:00h',
        fiesta_lugar_label:'Local:',
        fiesta_lugar_val: 'El Campito del Abuelo, Ibarlucea, Santa Fe',
        fiesta_mapa:      'Ver no Google Maps',
        dress_title:      'Dress Code',
        dress_ellas:      'Elas: Vestido.',
        dress_ellos:      'Eles: Camisa e calça social.',
        dress_prohibidos: 'Cores Proibidas: Bordô, Rosa, Dourado.',
        regalos_title:    'Presentes',
        regalos_texto:    'Sua presença é meu melhor presente, mas se desejar colaborar:',
        musica_title:     'Música',
        musica_texto:     'Qual música não pode faltar?',
        musica_nombre_ph: 'Seu Nome',
        musica_tema_ph:   'Música e Artista',
        musica_btn:       'Sugerir Música',
        momentos_title:   'Momentos',
        footer_texto:     'Espero por você para celebrarmos juntos!',
        // mensajes dinámicos de formularios
        msg_rsvp_ok:      'Obrigada por confirmar!',
        msg_rsvp_error:   'Houve um erro de conexão. Tente mais tarde.',
        msg_rsvp_limite:  'Prazo encerrado',
        msg_cancion_ok:   'Música sugerida com sucesso!',
        msg_cancion_error:'Houve um erro. Tente novamente.',
        btn_enviando:     'Enviando...',
        btn_confirmando:  'Confirmando...',
        btn_confirmado:   'Confirmado',
        btn_sugerir_otra: 'Sugerir outra',
    }
};

var idiomaActual = 'es';

function aplicarIdioma(lang) {
    idiomaActual = lang;
    var t = traducciones[lang];

    // Textos normales
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var clave = el.getAttribute('data-i18n');
        if (t[clave] !== undefined) el.textContent = t[clave];
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var clave = el.getAttribute('data-i18n-placeholder');
        if (t[clave] !== undefined) el.placeholder = t[clave];
    });

    // Botones activos del switch
    document.getElementById('lang-es').classList.toggle('lang-active', lang === 'es');
    document.getElementById('lang-pt').classList.toggle('lang-active', lang === 'pt');

    // Atributo lang del documento
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'es';
}

document.getElementById('lang-es').addEventListener('click', function() { aplicarIdioma('es'); });
document.getElementById('lang-pt').addEventListener('click', function() { aplicarIdioma('pt'); });

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
        btnRSVP.style.backgroundColor = '#555';
        btnRSVP.innerText = traducciones[idiomaActual].msg_rsvp_limite;

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

    btn.innerText = traducciones[idiomaActual].btn_enviando;
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
        msg.style.color = '#80EF80';
        msg.innerText = traducciones[idiomaActual].msg_cancion_ok;
        e.target.reset();
        btn.innerText = traducciones[idiomaActual].btn_sugerir_otra;
        btn.disabled = false;
    })
    .catch(error => {
        msg.style.color = '#DCA1A1';
        msg.innerText = traducciones[idiomaActual].msg_cancion_error;
        btn.innerText = traducciones[idiomaActual].musica_btn;
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

    btn.innerText = traducciones[idiomaActual].btn_confirmando;
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
        msg.innerText = traducciones[idiomaActual].msg_rsvp_ok;
        e.target.reset();
        btn.innerText = traducciones[idiomaActual].btn_confirmado;
        // Lo dejamos deshabilitado para evitar envíos duplicados por error
    })
    .catch(error => {
        msg.style.color = '#DCA1A1';
        msg.innerText = traducciones[idiomaActual].msg_rsvp_error;
        btn.innerText = traducciones[idiomaActual].rsvp_btn;
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
