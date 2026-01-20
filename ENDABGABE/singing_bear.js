/* ============================================================================
   SINGING_BEAR.JS - SING-SEITE FÜR DAS HAUSTIER
   ============================================================================
   
   Diese Seite erlaubt dem Benutzer:
   - Den singenden Bären anzuschauen
   - Die Singmusik abzuspielen/zu pausieren
   - Mit einem "Zurück"-Button zur Hauptseite zu gehen
   
   ============================================================================ */

// Diese Funktion läuft AUTOMATISCH, sobald die HTML-Seite vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================================================
  // 1. ELEMENTE FINDEN
  // ========================================================================
  
  // Suche das Bären-Bild (damit wir wissen wo es ist)
  const bearImage = document.getElementById('bearImage');
  
  // Suche das Audio-Element (den Musik-Player für das Lied)
  const audioPlayer = document.getElementById('audioPlayer');
  
  // Suche den "Zurück"-Button (um zur Hauptseite zu gehen)
  const backBtn = document.getElementById('back-btn');

  // ========================================================================
  // 2. KLICK AUF BÄREN = MUSIK SPIELEN/PAUSIEREN
  // ========================================================================
  
  // Prüfe: Existieren das Bild und der Audio-Player?
  if (bearImage && audioPlayer) {
    
    // Wenn der Benutzer auf den Bären klickt...
    bearImage.addEventListener('click', () => {
      // Prüfe: Spielt die Musik gerade?
      if (audioPlayer.paused) {
        // NEIN - Also spielen wir sie ab
        audioPlayer.play().catch(() => { 
          // Falls Autoplay blockiert ist, ignoriere den Fehler
        });
      } else {
        // JA - Also pausieren wir sie
        audioPlayer.pause();
        // Setze die Musik auf den Anfang zurück
        audioPlayer.currentTime = 0;
      }
    });

    // =====================================================================
    // 3. MUSIK-WIEDERHOLEN (am Ende wieder von vorne spielen)
    // =====================================================================
    
    // Wenn die Musik zu Ende ist...
    audioPlayer.addEventListener('ended', () => {
      // Setze sie auf den Anfang zurück
      audioPlayer.currentTime = 0;
      // Und spielen sie erneut ab
      audioPlayer.play().catch(() => {});
    });
  }

  // ========================================================================
  // 4. ZURÜCK-BUTTON (Gehe zurück zur Hauptseite)
  // ========================================================================
  
  // Prüfe: Existiert der Zurück-Button?
  if (backBtn) {
    // Wenn der Benutzer auf den Zurück-Button klickt...
    backBtn.addEventListener('click', (e) => {
      // Verhindere die Standard-Button-Aktion
      e.preventDefault();
      
      // Setze ein Speicher-Flag: "Springe die Ei-Animation"
      // Das verhindert, dass der Benutzer nochmal das Ei sehen muss
      sessionStorage.setItem('skipEggAnimation', '1');
      
      // Setze ein anderes Flag: "Springe zu den Sidebars"
      // Das sorgt dafür, dass die Buttons sofort sichtbar sind
      sessionStorage.setItem('jumpTo', 'sidebarsLoaded');
      
      // Navigiere zur Hauptseite
      window.location.href = 'room.html';
      // Das ist wie ein "Neustart" - die Seite lädt neu
      // Aber OHNE die Ei-Animation weil wir die Flags gesetzt haben
    });
  }
});

/* ============================================================================
   ZUSAMMENFASSUNG:
   
   1. Wenn auf den Bären geklickt wird → Musik spielen/pausieren
   2. Wenn die Musik zu Ende ist → Von vorne spielen
   3. Wenn "Zurück" geklickt wird → Mit Flags zur Hauptseite navigieren
   
   ============================================================================ */
