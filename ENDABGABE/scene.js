/* ============================================================================
   SCENE.JS - AR-MARKER ERKENNUNG UND BUTTON-ANZEIGE
   ============================================================================
   
   Diese Seite arbeitet mit AR.js zusammen um:
   - AR-Marker (QR-ähnliche Codes) zu erkennen
   - Einen Button anzuzeigen wenn der Marker erkannt wird
   - Zum Hauptspiel zu navigieren wenn der Button geklickt wird
   
   Hinweis: Dies verwendet die aframe-marker-ar.js Library
   
   ============================================================================ */

// ========================================================================
// 1. ELEMENTE FINDEN
// ========================================================================

// Finde das AR-Marker-Element (in der HTML mit <a-marker> definiert)
// Ein "Marker" ist wie ein QR-Code der von der Kamera erkannt werden kann
const marker = document.querySelector("#marker");

// Finde den AR-Button der angezeigt werden soll
// Der Button sagt dem Benutzer: "Klick mich um das Spiel zu spielen"
const arBtn = document.querySelector("#ar-button");

// ========================================================================
// 2. VARIABLEN
// ========================================================================

// Verfolge ob der Button gerade sichtbar ist
let buttonVisible = false;

// ========================================================================
// 3. MARKER ERKANNT - ZEIGE DEN BUTTON
// ========================================================================

// Wenn der AR-Marker erkannt wird (der User hält das Plakat in die Kamera)...
marker.addEventListener("markerFound", () => {
  // Zeige den Button auf dem Bildschirm
  arBtn.style.display = "block";
  
  // Merke dass der Button sichtbar ist
  buttonVisible = true;
});

// ========================================================================
// 4. MARKER VERLOREN - VERSTECKE DEN BUTTON
// ========================================================================

// Wenn der AR-Marker aus dem Bild geht (der User bewegt die Kamera weg)...
marker.addEventListener("markerLost", () => {
  // Verstecke den Button
  arBtn.style.display = "none";
  
  // Merke dass der Button nicht mehr sichtbar ist
  buttonVisible = false;
});

// ========================================================================
// 5. BUTTON-KLICK: GEHE ZUM SPIEL (MOUSE/POINTER)
// ========================================================================

// Wenn der Benutzer auf den AR-Button klickt (mit Maus/Touchscreen)...
arBtn.addEventListener("click", () => {
  // Sicherheitsprüfung: Ist der Button überhaupt sichtbar?
  if (!buttonVisible) return; // Falls nein, tu nichts
  
  // Der Button war sichtbar, also navigiere zum Spiel
  // Dies ist eine URL zu deinem Github-Pages gehosteten Spiel
  window.location.href = 
    "https://jennisinger.github.io/Obiquous-computing/ENDABGABE/room.html";
  // window.location.href = eine neue Seite laden (wie einen Hyperlink anklicken)
});

// ========================================================================
// 6. BUTTON-KLICK: GEHE ZUM SPIEL (TOUCH)
// ========================================================================

// Wenn der Benutzer den AR-Button berührt (Touchscreen)...
// Dies ist nötig für Mobile-Geräte die nur Touch unterstützen
arBtn.addEventListener("touchstart", () => {
  // Sicherheitsprüfung: Ist der Button überhaupt sichtbar?
  if (!buttonVisible) return; // Falls nein, tu nichts
  
  // Der Button war sichtbar, also navigiere zum Spiel
  window.location.href = 
    "https://jennisinger.github.io/Obiquous-computing/ENDABGABE/room.html";
});

/* ============================================================================
   ZUSAMMENFASSUNG DES AR-FLOWS:
   
   1. User öffnet die index.html im Browser
   2. AR.js startet die Kamera
   3. User hält das Plakat mit dem QR-Code in die Kamera
   4. Der Marker wird erkannt → "markerFound" Event wird ausgelöst
   5. Der Button wird angezeigt
   6. User klickt den Button
   7. Die Seite navigiert zum Spiel (room.html)
   8. Das Spiel startet mit der Ei-Animation
   
   ============================================================================ */
