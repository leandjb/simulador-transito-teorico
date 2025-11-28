// simulador.js - Lógica del simulador de tránsito


const DB_FILES = [
  'db/preguntas-formato-simulador.txt',
  'db/preguntas-conduccion.txt',
  'db/preguntas-comportamiento-vial.txt'
];

let preguntasBanco = [];
let preguntasSeleccionadas = [];
let respuestasUsuario = [];

// Utilidad para leer archivos locales (solo funciona en entorno de servidor o localhost)
async function cargarPreguntas() {
  let preguntas = [];
  for (const file of DB_FILES) {
    const res = await fetch(file);
    if (res.ok) {
      const txt = await res.text();
      preguntas = preguntas.concat(parsePreguntas(txt));
    }
  }
  return preguntas;
}

// Asume formato: pregunta|opcionA|opcionB|opcionC|opcionD|respuestaCorrecta
function parsePreguntas(texto) {
  return texto.split('\n').map(linea => {
    const partes = linea.split('|');
    if (partes.length < 6) return null;
    return {
      pregunta: partes[0],
      opciones: partes.slice(1, 5),
      respuesta: partes[5].trim().toUpperCase()
    };
  }).filter(Boolean);
}

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// Nueva lógica: una pregunta a la vez con animación
let preguntaActual = 0;

function mostrarPreguntaIndividual(idx = 0) {
  quizSection.innerHTML = '';
  if (idx >= preguntasSeleccionadas.length) {
    evaluarSimulacro();
    return;
  }
  const preg = preguntasSeleccionadas[idx];
  const card = document.createElement('div');
  card.className = 'card fade-in';
  card.innerHTML = `
    <div class="question" id="q${idx}-label">${idx + 1}. ${preg.pregunta}</div>
    <div class="options">
      ${preg.opciones.map((op, i) => `
        <label>
          <input type="radio" name="q${idx}" value="${String.fromCharCode(65 + i)}" aria-labelledby="q${idx}-label" tabindex="0"> ${op}
        </label>
      `).join('')}
    </div>
    <div style="text-align:right; font-size:0.95em; color:var(--primary);">Pregunta ${idx+1} de 10</div>
  `;
  // Feedback visual y avanzar automáticamente
  card.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', e => {
      card.querySelectorAll('label').forEach(lab => lab.style.background = '');
      e.target.parentElement.style.background = 'rgba(25, 118, 210, 0.08)';
      setTimeout(() => {
        respuestasUsuario[idx] = e.target.value;
        mostrarPreguntaIndividual(idx + 1);
      }, 350);
    });
  });
  quizSection.appendChild(card);
}

function evaluarSimulacro() {
  let fallos = 0;
  let preguntasFalladas = [];
  preguntasSeleccionadas.forEach((preg, idx) => {
    const respuesta = respuestasUsuario[idx] || null;
    if (respuesta !== preg.respuesta) {
      fallos++;
      preguntasFalladas.push({
        idx,
        pregunta: preg.pregunta,
        opciones: preg.opciones,
        respuestaCorrecta: preg.respuesta,
        respuestaUsuario: respuesta
      });
    }
  });
  mostrarResultado(fallos, preguntasFalladas);
}

function mostrarResultado(fallos, preguntasFalladas) {
  const quizSection = document.getElementById('quiz-section');
  quizSection.style.display = 'none';
  const resultSection = document.getElementById('result-section');
  resultSection.style.display = 'block';
  const aprobado = fallos < 2;
  resultSection.innerHTML = `
    <div class="result ${aprobado ? 'success' : 'fail'}">
      ${aprobado ? '¡Felicidades! Has aprobado el simulacro.' : 'No has aprobado el simulacro.'}
        <br>Fallaste en <b>${fallos}</b> pregunta${fallos === 1 ? '' : 's'}.<br>
    </div>
    <h2>Preguntas falladas</h2>
    ${preguntasFalladas.length === 0 ? '<p>¡No fallaste ninguna pregunta!</p>' : preguntasFalladas.map(f => `
      <div class="card">
        <div class="question">${f.idx + 1}. ${f.pregunta}</div>
        <div class="options">
          ${f.opciones.map((op, i) => {
            const letra = String.fromCharCode(65 + i);
            let clase = '';
            if (letra === f.respuestaCorrecta) clase = 'success';
            if (letra === f.respuestaUsuario && letra !== f.respuestaCorrecta) clase = 'fail';
            return `<span class="${clase}">${letra}. ${op}</span>`;
          }).join('')}
        </div>
        <div><b class="success">Respuesta correcta: ${f.respuestaCorrecta}</b></div>
        <div><b class="${f.respuestaUsuario === f.respuestaCorrecta ? 'success' : 'fail'}">Tu respuesta: ${f.respuestaUsuario || 'Sin responder'}</b></div>
      </div>
    `).join('')}
    <button onclick="window.location.reload()">Reintentar</button>
  `;
}

// Modo oscuro
const toggleDark = document.getElementById('toggle-dark');
function setDarkIcon() {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  toggleDark.innerHTML = isDark ? '🌙' : '☀️';
  toggleDark.setAttribute('aria-label', isDark ? 'Modo claro' : 'Modo oscuro');
}
toggleDark.onclick = () => {
  const theme = document.body.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  setDarkIcon();
};
window.onload = () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.setAttribute('data-theme', 'dark');
  setDarkIcon();
};

// Iniciar simulacro
const startBtn = document.getElementById('start-btn');
const welcomeSection = document.getElementById('welcome-section');
const quizSection = document.getElementById('quiz-section');
startBtn.onclick = async () => {
  startBtn.disabled = true;
  if (welcomeSection) welcomeSection.style.display = 'none';
  if (quizSection) quizSection.style.display = 'block';
  preguntasBanco = await cargarPreguntas();
  mezclarArray(preguntasBanco);
  preguntasSeleccionadas = preguntasBanco.slice(0, 10);
  respuestasUsuario = new Array(10);
  preguntaActual = 0;
  mostrarPreguntaIndividual(0);
};
