// SCENE.JS - AR-MARKER ERKENNUNG UND BUTTON 

// 1. ELEMENTE FINDEN
// Finde das AR-Marker-Element 
const marker = document.querySelector("#marker");

// Finde den AR-Button der angezeigt werden soll
const arBtn = document.querySelector("#ar-button");


// 2. VARIABLEN
// Verfolge ob der Button gerade sichtbar ist
let buttonVisible = false;


// 3. MARKER ERKANNT - BUTTON ERSCHEINT
marker.addEventListener("markerFound", () => {
  // Zeige den Button auf dem Bildschirm
  arBtn.style.display = "block";

  // Merkt dass Button sichtbar ist
  buttonVisible = true;
});


// 4. MARKER VERLOREN - VERSTECKT BUTTON
// Wenn der AR-Marker aus dem Bild geht (User bewegt Kamera weg)
marker.addEventListener("markerLost", () => {
  // Versteckt den Button
  arBtn.style.display = "none";

  // Merkt dass Button nicht mehr sichtbar ist
  buttonVisible = false;
});


// 5. BUTTON-KLICK: GEHE ZUM SPIEL 
// Wenn der Benutzer auf den Button klickt 
arBtn.addEventListener("click", () => {
  // Sicherheitsprüfung: Ist Button überhaupt sichtbar?
  if (!buttonVisible) return; // Falls nein passiert nichts

  // Der Button war sichtbar, also navigiere zum Spiel
  window.location.href = "room.html";
});

// 6. BUTTON-KLICK: GEHE ZUM SPIEL (TOUCH)

// Wenn der Benutzer den AR-Button berührt (Touchscreen)
arBtn.addEventListener("touchstart", () => {
  // Sicherheitsprüfung: Ist Button überhaupt sichtbar?
  if (!buttonVisible) return; // Falls nein passiert nichts

  // Der Button war sichtbar, also navigiere zum Spiel
  window.location.href = "room.html";
});


