// Konstanten
const canvas = document.getElementById("meinCanvas");
const ctx = canvas.getContext("2d");

const FARBE = "lightgreen";   // Konstante für Farbe
const START_X = 40;           // Startposition X
const START_Y = 30;           // Startposition Y

// Funktion, die ein Rechteck zeichnet
function zeichneRechteck(breite, hoehe) {
    ctx.fillStyle = FARBE;
    ctx.fillRect(START_X, START_Y, breite, hoehe);
}

// Aufruf der Funktion
zeichneRechteck(200, 80);