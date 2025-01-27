let timeLeft = 7200; // Tiempo de examen en segundos
let penalty = 10; // Puntos a restar por cambiar de pestaña
let points = 100; // Puntos totales del examen
let warningCount = 0; // Contador de advertencias
const correctPin = '6623'; // PIN correcto

const timeElement = document.getElementById('time');
const warningElement = document.getElementById('warning');

// Función para validar el Nombre y PIN
function checkCredentials() {
    const nameInput = document.getElementById('nameInput').value.trim();
    const pinInput = document.getElementById('pinInput').value.trim();

    if (nameInput !== '' && pinInput === correctPin) {
        document.getElementById('pinContainer').style.display = 'none';
        document.getElementById('examContent').style.display = 'block';
        startTimer();
    } else {
        document.getElementById('pinError').style.display = 'block';
    }
}

// Función para convertir segundos a formato HH:MM:SS
function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// Función para iniciar el temporizador
function startTimer() {
    const timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeElement.textContent = formatTime(timeLeft);
        } else {
            clearInterval(timer);
            alert("El tiempo ha terminado");
            submitExam(); // Envía automáticamente las respuestas cuando el tiempo se acaba
        }
    }, 1000);
}

// Función para restar puntos
function handleVisibilityChange() {
    if (document.hidden || document.visibilityState === 'hidden') {
        warningCount++;
        points -= penalty;
        warningElement.textContent = `Advertencia ${warningCount}: No cambies de pestaña. Has perdido ${penalty} puntos.`;
    }
}

// Agregar el listener para detectar cambios de pestaña
document.addEventListener('visibilitychange', handleVisibilityChange);

// También puedes usar 'blur' para detectar cuando la ventana pierde el foco
window.addEventListener('blur', handleVisibilityChange);

// Función para enviar el examen, guardar en PDF y redirigir
function submitExam() {
    clearInterval(timeLeft); // Detiene el temporizador

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener el nombre, código del textarea
    const name = document.getElementById('nameInput').value.trim();
    const code = document.getElementById('code').value.trim();

    // Formatear el código para el PDF
    const formattedCode = code
        .replace(/\t/g, '    ') // Reemplaza tabulaciones con espacios
        .split('\n') // Divide en líneas
        .map((line, idx) => `${idx + 1}: ${line}`) // Añade números de línea
        .join('\n');

    // Configurar el PDF con estilo amigable
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Resultados del Examen', 10, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Nombre del Estudiante: ${name}`, 10, 25);
    doc.text(`Número de advertencias: ${warningCount}`, 10, 35);

    doc.setFont('courier', 'normal'); // Fuente monoespaciada para código
    doc.setFontSize(10);
    doc.text('Código ingresado:', 10, 45);

    // Añadir código con resaltado de sintaxis
    doc.setDrawColor(200, 200, 200); // Color gris para bordes
    doc.rect(10, 50, 190, 200); // Contenedor del código
    doc.setTextColor(50, 50, 50); // Texto en gris oscuro
    doc.text(formattedCode, 12, 55, { maxWidth: 186 });

    // Guardar el PDF
    doc.save('examen_resultado.pdf');

    // Esperar 5 segundos y redirigir
    setTimeout(() => {
        window.location.href = "https://teams.microsoft.com/l/message/19:vMeyOsex9uupiL7GvIHXusqdEq4rwRHfRDtRWUbTFOE1@thread.tacv2/1737993589970?tenantId=d8e3bd44-0bba-426b-952d-ada7bb17393c&groupId=1bf8e2cb-e994-414a-9c08-3f059c7e5a37&parentMessageId=1737993589970&teamName=ICT%20Second%20Year&channelName=General&createdTime=1737993589970";
    }, 5000);
}

function refreshIframe() {
    const iframe = document.getElementById('myIframe');
    iframe.src = iframe.src; // Esto recarga el iframe
}
