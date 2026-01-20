
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. GRUNDELEMENTE LADEN

  // Spielfläche aufrufen
  const playArea = document.getElementById("play-area");
  
  // Fehlermeldung der Konsole: Falls die Spielfläche nicht existiert stoppt alles
  if (!playArea) {
    console.error("play-area fehlt im DOM - die Seite ist kaputt!");
    return; 
  }
  

  // 2. HILFSFUNKTION: Sidebars erstellen oder holen

  // erstellt die Button-Leisten
  function getOrCreateSidebar(id, html) {
    // Suche nach einem Element mit dieser ID
    let el = document.getElementById(id); // El = Variable für das Element‚
    
    // Sorgt dafür dass die Sidebars nur einmal erstellt werden 
    if (!el) { 
      el = document.createElement("div"); // Neuer Behälter (Container)
      el.id = id;  // Gib ihm eine ID
      el.className = id === "sidebar-top" ? "sidebar-top" : "sidebar"; // CSS-Klasse
      el.innerHTML = html; // Füge den HTML-Code ein (die Buttons)
      playArea.appendChild(el); // Hänge es in die Spielfläche ein
    }
    return el; // Gib das Element zurück (zum Speichern in einer Variable)
  }


  // 3. EI UND PET LADEN

  // Versucht das Ei zu finden, oder erstellt es, falls es nicht existiert
  const eggExisting = document.getElementById("egg");
  let egg = eggExisting || (() => {
    // Falls das Ei nicht in der HTML ist wird es erstellt als Bild
    const eggo = document.createElement("img");
    eggo.id = "egg";
    eggo.src = "assets/egg.png"; // Die Bilddatei für das Ei
    eggo.alt = "Ei"; // Text falls Bild nicht lädt
    eggo.className = "";
    playArea.appendChild(eggo); // Hänge es in die Spielfläche ein
    return eggo; // Gib das Ei zurück
  })();

  // Verhindert, dass der Bär (pet) doppelt existiert
  const petbear = document.querySelectorAll("#pet");
  let pet = petbear[0] || null; // Nimmt das erste Pet oder null
  
  // Wenn es mehrere pets gibt, löscht es alle außer den ersten
  if (petbear.length > 1) {
    for (let i = 1; i < petbear.length; i++) { 
      petbear[i].remove(); // Löscht das doppelte Pet
    }
  }
  
  // Falls kein Pet existiert, erstellt es eins
  if (!pet) {
    pet = document.createElement("img");
    pet.id = "pet";
    pet.src = "assets/bear.png"; 
    pet.alt = "Tier";
    pet.classList.add("hidden"); // Versteckt es am Anfang
    playArea.appendChild(pet);
  }


  // 4. SIDEBARS ERSTELLEN (Die Button-Leisten)
  
  // Linke Sidebar - Buttons für Füttern und Energie
  const sidebarLeft = getOrCreateSidebar("sidebar-left", `
    <button class="side-btn" id="feed">🍔</button>
    <button class="side-btn" id="energy">💡</button>
  `);

  // Rechte Sidebar - Buttons für Spiele
  const sidebarRight = getOrCreateSidebar("sidebar-right", `
    <button class="side-btn" id="tic-tac-toe">🎮</button>
    <button class="side-btn" id="sing">🎤</button>
  `);

  // Obere Sidebar - Die Stats (Hunger und Energie Balken)
  const sidebarTop = document.getElementById("sidebar-top") || getOrCreateSidebar("sidebar-top", `
    <div class="stat-item">
      <div class="stat-label">Hunger</div>
      <div class="stat-bar"><div id="hunger-fill" class="stat-fill"></div></div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Energie</div>
      <div class="stat-bar"><div id="energy-fill" class="stat-fill"></div></div>
    </div>
  `);


  // 5. ANFANGS-SICHTBARKEIT VON SIDEBAR & PET
  
  // Am Anfang sind die Sidebars NICHT sichtbar (versteckt)
  if (sidebarLeft) sidebarLeft.classList.remove("visible");
  if (sidebarRight) sidebarRight.classList.remove("visible");
  if (sidebarTop) sidebarTop.classList.remove("visible");
  
  // Das Pet ist versteckt, das Ei ist sichtbar
  pet.classList.add("hidden");
  egg.classList.remove("hidden");


  // 6. NACHT-OVERLAY 
  
  let nightOverlay = document.getElementById("night-overlay");
  if (!nightOverlay) {
    nightOverlay = document.createElement("div");
    nightOverlay.id = "night-overlay"; // Der dunkle Schirm
    document.body.appendChild(nightOverlay);
  }
  nightOverlay.classList.remove("active"); // Am Anfang nicht aktiv


  // 7. ÜBERPRÜFT, OB DAS SPIEL SCHON GELADEN WURDE 

  // Prüft ob der Bär bereits geschlüpft ist
  const persistentHatched = localStorage.getItem("petHatched") === "1";
  
  // Prüft ob man vom Singing-Bear zurückkommt, wenn ja dann wird Schlüpf-Animation geskippt
  const transientSkip = sessionStorage.getItem("skipEggAnimation") === "1";


  // 8. EI-ANIMATION 
  
  // Funktion startet das Pulsieren von Ei 
  function startEggPulse() {
    egg.classList.remove("hidden"); // Zeige das Ei
    egg.classList.add("egg-pulsing"); // Starte die Animation (in CSS definiert)
  }

  // Funktion stoppt das Pulsieren von Ei
  function stopEggPulse() {
    egg.classList.remove("egg-pulsing"); // Entfernt die Animation
  }

  // TEMP: Lösche den Speicher für Testing (später auskommentieren wenn Speicher wichtig ist) 
  localStorage.removeItem("petHatched");
  
  // Logik: Soll das Ei pulsieren?
  // Ja, WENN das Pet noch nicht geschlüpft ist UND wir nicht vom Singing-Bear zurückkommen
  if (!persistentHatched && !transientSkip) {
    startEggPulse(); // Starte die Animation
  } else {
    stopEggPulse(); // Verstecke das Ei und zeige den Bären
  }


  // 9. STATS (Hunger und Energie)
  
  // Speichere die Werte des Haustiers
  const stats = { 
    hunger: 100,  // 0-100 (0 = sehr hungrig, 100 = satt)
    energy: 80    // 0-100 (0 = müde, 100 = volle Energie)
  };
  
  let __statsInterval = null; // Speicher für den Aktualisierungs-Timer

  // Funktion: Update die visuellen Balken (grüne Linien)
  function updateStatsUI() {
    const h = document.getElementById("hunger-fill"); // Der Hunger-Balken
    const e = document.getElementById("energy-fill"); // Der Energie-Balken
    
    // Setze die Breite der Balken basierend auf den Werten
    if (h) h.style.width = Math.max(0, Math.min(100, stats.hunger)) + "%";
    if (e) e.style.width = Math.max(0, Math.min(100, stats.energy)) + "%";
  }

  // Funktion: Ändere einen Stat-Wert (z.B. +20 Hunger wenn gefüttert)
  function changeStat(name, delta) {
    // Prüfe ob dieser Stat existiert
    if (!(name in stats)) return;
    
    // Ändere den Wert (aber nicht unter 0 oder über 100)
    stats[name] = Math.max(0, Math.min(100, stats[name] + delta));
    
    // Update die Grafik
    updateStatsUI();
  }
  
  // Mache diese Funktion global (von außen aufrufbar)
  window.changeStat = changeStat;

  // Funktion: Starte den Timer, der regelmäßig die Stats senkt
  function startStatsInterval() {
    if (__statsInterval) return; // Falls bereits läuft, stoppe
    
    // Alle 5 Sekunden werden die Stats reduziert
    __statsInterval = setInterval(() => {
      // Prüfe ob das Pet schläft (Nacht-Overlay aktiv)
      const sleeping = nightOverlay.classList.contains("active");
      
      // Falls nicht schlafen, lasse Hunger und Energie sinken
      if (!sleeping) {
        changeStat("hunger", -3);  // -3 Hunger alle 5 Sekunden
        changeStat("energy", -1);  // -1 Energie alle 5 Sekunden
      }
    }, 5000);
  }

  // Funktion: Stoppe den Timer
  function stopStatsInterval() {
    if (!__statsInterval) return; // Falls nicht läuft, stoppe
    clearInterval(__statsInterval);
    __statsInterval = null;
  }

  // Funktion: Initialisiere die Stats (am Anfang oder nach Ei-Schlüpfen)
  function initStats() {
    updateStatsUI(); // Update die Grafik einmal
    startStatsInterval(); // Starte den regelmäßigen Timer
    if (sidebarTop) sidebarTop.classList.add("visible"); // Zeige die Top-Sidebar
  }

  // ========================================================================
  // 10. ALTE HILFSFUNKTION (kann gelöscht werden, wird nicht mehr benutzt)
  // ========================================================================
  
  // Diese Funktion wurde durch direkte Logik ersetzt, kann aber Fehler verhindern
  function revealSidebarsAndMaybeJump({ persist = false } = {}) {
    // Verstecke das Ei
    if (egg && !egg.classList.contains("hidden")) {
      egg.classList.add("hidden");
      egg.classList.remove("egg-hatching");
      stopEggPulse();
    }
    
    // Zeige das Pet
    if (pet) {
      pet.classList.remove("hidden");
      pet.classList.add("shown");
    }

    // Zeige alle Sidebars
    if (sidebarLeft) sidebarLeft.classList.add("visible");
    if (sidebarRight) sidebarRight.classList.add("visible");
    if (sidebarTop) sidebarTop.classList.add("visible");

    // Speichere den Zustand falls gewünscht
    if (persist) {
      localStorage.setItem("petHatched", "1");
    }

    // Initialisiere die Stats
    if (typeof initStats === "function") initStats();

    // Sende ein Signal, dass die Sidebars fertig sind (für andere Scripts)
    window.dispatchEvent(new Event("sidebars-ready"));

    // Falls der Benutzer vom Singing-Bear zurückkommt, scrolle zu den Sidebars
    if (sessionStorage.getItem("jumpTo") === "sidebarsLoaded") {
      const target = document.getElementById("sidebar-top") || 
                     document.getElementById("sidebar-left") || 
                     document.getElementById("sidebar-right");
      if (target) {
        try { 
          target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); 
        } catch (e) {}
        if (typeof target.focus === "function") target.focus();
      }
      sessionStorage.removeItem("jumpTo");
    }

    sessionStorage.removeItem("skipEggAnimation");
  }

  // ========================================================================
  // 11. EI-SCHLÜPF-LOGIK (Hauptspiel-Mechanik!)
  // ========================================================================
  
  // Wenn der Benutzer auf das Ei klickt...
  egg.addEventListener("click", () => {
    // Prüfe: Ist das Ei bereits versteckt oder wird gerade geschlüpft?
    if (egg.classList.contains("hidden") || egg.classList.contains("egg-hatching")) {
      return; // Falls ja, tu nichts
    }

    // Starte die Schlüpf-Animation (das Wackeln)
    egg.classList.add("egg-hatching");

    let finished = false; // Verhindere Doppel-Ausführung
    
    // Diese Funktion läuft wenn die Animation fertig ist
    const finishHatch = () => {
      if (finished) return; // Falls schon gemacht, stoppe
      finished = true;

      // ===== ANIMATION FERTIG - ZEIGE JETZT DEN BÄREN =====
      
      egg.classList.add("hidden"); // Verstecke das Ei
      egg.classList.remove("egg-hatching"); // Entferne Animation

      // Zeige das Pet (Bären)
      if (pet) {
        pet.classList.remove("hidden");
        pet.classList.add("shown");
      }

      // Speichere dass das Pet geschlüpft ist
      localStorage.setItem('petHatched', '1');

      // Zeige die Sidebars
      if (sidebarLeft) sidebarLeft.classList.add("visible");
      if (sidebarRight) sidebarRight.classList.add("visible");
      if (sidebarTop) sidebarTop.classList.add("visible");

      // Starte die Stats
      initStats();
    };

    // Warte bis die CSS-Animation fertig ist
    egg.addEventListener("animationend", finishHatch, { once: true });
    egg.addEventListener("webkitAnimationEnd", finishHatch, { once: true });
    
    // Falls die Animation nicht registriert wird, mache es nach 1,6 Sekunden trotzdem
    setTimeout(finishHatch, 1600);
  });

  // ========================================================================
  // 12. LOGIK FÜR SPIELWIEDERAUFNAHME (wenn Seite neu geladen wird)
  // ========================================================================
  
  // Falls das Pet bereits geschlüpft ist (und Speicher noch da)
  if (persistentHatched) {
    // Zeige den Bären und die Sidebars sofort
    egg.classList.add("hidden");
    pet.classList.remove("hidden");
    pet.classList.add("shown");
    sidebarLeft.classList.add("visible");
    sidebarRight.classList.add("visible");
    if (sidebarTop) sidebarTop.classList.add("visible");
    initStats();
  } 
  // Falls wir vom Singing-Bear zurückkommen
  else if (transientSkip) {
    // Selbes wie oben - zeige Bären und Sidebars sofort
    egg.classList.add("hidden");
    pet.classList.remove("hidden");
    pet.classList.add("shown");
    sidebarLeft.classList.add("visible");
    sidebarRight.classList.add("visible");
    if (sidebarTop) sidebarTop.classList.add("visible");
    initStats();
    
    // Scrolle zu den Sidebars falls gewünscht
    if (sessionStorage.getItem("jumpTo") === "sidebarsLoaded") {
      const target = document.getElementById("sidebar-top") || 
                     document.getElementById("sidebar-left") || 
                     document.getElementById("sidebar-right");
      if (target) {
        try { 
          target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); 
        } catch (e) {}
        if (typeof target.focus === "function") target.focus();
      }
      sessionStorage.removeItem("jumpTo");
    }
    sessionStorage.removeItem("skipEggAnimation");
  }

  // ========================================================================
  // 13. SCHLAF-MECHANIK (Nacht-Overlay und Schlaflied)
  // ========================================================================
  
  // Finde den Energie-Button (💡)
  const sleepBtn = document.getElementById("sleep") || document.getElementById("energy");
  let sleepRechargeInterval = null; // Timer für Energie-Aufladung
  let snoreSound = null; // Das Schlaflied

  if (sleepBtn) {
    // Wenn der Benutzer auf den Schlaf-Button klickt...
    sleepBtn.addEventListener("click", () => {
      // Toggle = schalte Schlaf an/aus
      const nowSleeping = nightOverlay.classList.toggle("active");
      
      if (nowSleeping) {
        // ===== GEHE SCHLAFEN =====
        
        // Spiele das Schlaflied ab
        if (!snoreSound) { 
          snoreSound = new Audio("assets/lullaby.wav");
          snoreSound.loop = true; // Wiederhole das Lied
        }
        snoreSound.currentTime = 0;
        snoreSound.play().catch(() => {}); // Ignoriere Fehler falls kein Sound abspielen kann

        // Starte langsame Energie-Aufladung während schlafen
        if (!sleepRechargeInterval) {
          sleepRechargeInterval = setInterval(() => {
            changeStat("energy", +15); // +15 Energie alle 4 Sekunden
          }, 4000);
        }
      } else {
        // ===== AUFWACHEN =====
        
        // Stoppe den Timer
        if (sleepRechargeInterval) { 
          clearInterval(sleepRechargeInterval); 
          sleepRechargeInterval = null; 
        }
        
        // Stoppe das Schlaflied
        if (snoreSound) { 
          snoreSound.pause(); 
          snoreSound.currentTime = 0; 
        }
        
        // Gib kleine Energie-Bonus beim Aufwachen
        changeStat("energy", +10);
      }
    });

    // Erlaube Klick auf den dunklen Schirm um aufzuwachen
    nightOverlay.addEventListener("click", () => {
      if (nightOverlay.classList.contains("active")) {
        // Schalte das Overlay aus
        nightOverlay.classList.remove("active");
        
        // Stoppe Timer und Sound
        if (sleepRechargeInterval) { 
          clearInterval(sleepRechargeInterval); 
          sleepRechargeInterval = null; 
        }
        if (snoreSound) { 
          snoreSound.pause(); 
          snoreSound.currentTime = 0; 
        }
        
        // Bonus beim Aufwachen
        changeStat("energy", +10);
      }
    });
  }

  // ========================================================================
  // 14. RESPONSIVE LAYOUT (Mobile vs Desktop)
  // ========================================================================
  
  // Diese Funktion sortiert die Buttons je nach Bildschirmgröße um
  function applyResponsiveLayout() {
    // Prüfe: Ist der Bildschirm klein (Handy)?
    const mobile = window.innerWidth <= 700;
    
    // Suche nach einer Bottom-Bar (für Handy unten)
    let bottomBar = document.getElementById("bottom-bar");

    if (mobile) {
      // ===== HANDY-LAYOUT =====
      
      // Erstelle Bottom-Bar falls nicht vorhanden
      if (!bottomBar) {
        bottomBar = document.createElement("div");
        bottomBar.id = "bottom-bar";
        bottomBar.className = "sidebar";
        document.body.appendChild(bottomBar);
      }
      
      // Verschiebe die Sidebars nach unten
      if (sidebarLeft && sidebarLeft.parentElement !== bottomBar) bottomBar.appendChild(sidebarLeft);
      if (sidebarRight && sidebarRight.parentElement !== bottomBar) bottomBar.appendChild(sidebarRight);
      if (sidebarTop && sidebarTop.parentElement !== document.body) document.body.appendChild(sidebarTop);
      if (nightOverlay && nightOverlay.parentElement !== document.body) document.body.appendChild(nightOverlay);
    } else {
      // ===== DESKTOP-LAYOUT =====
      
      // Verschiebe Sidebars zurück zur Spielfläche
      if (sidebarLeft && sidebarLeft.parentElement !== playArea) playArea.appendChild(sidebarLeft);
      if (sidebarRight && sidebarRight.parentElement !== playArea) playArea.appendChild(sidebarRight);
      if (sidebarTop && sidebarTop.parentElement !== playArea) playArea.insertBefore(sidebarTop, playArea.firstChild);
      
      // Lösche Bottom-Bar falls leer
      if (bottomBar && bottomBar.childElementCount === 0) bottomBar.remove();
      if (nightOverlay && nightOverlay.parentElement !== document.body) document.body.appendChild(nightOverlay);
    }
  }

  // Wende das Layout einmal am Anfang an
  applyResponsiveLayout();
  
  // Wenn der Benutzer die Fenstergröße ändert, passe das Layout an
  let __layoutTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(__layoutTimer); // Verhindere zu häufige Updates
    __layoutTimer = setTimeout(applyResponsiveLayout, 120); // Warte 120ms dann update
  });

  // ========================================================================
  // 15. NAVIGATION ZU ANDEREN SEITEN
  // ========================================================================
  
  // Wenn der Benutzer auf den TicTacToe-Button klickt, gehe zur TicTacToe-Seite
  const tttBtn = document.getElementById("tic-tac-toe");
  if (tttBtn) tttBtn.addEventListener("click", () => { 
    window.location.href = "tictactoe.html"; 
  });

  // Wenn der Benutzer auf den Singing-Button klickt, gehe zur Singing-Bear-Seite
  const singBtn = document.getElementById("sing");
  if (singBtn) singBtn.addEventListener("click", () => { 
    window.location.href = "singing_bear.html"; 
  });

  // ========================================================================
  // 16. CANVAS-HINTERGRUND (Die Wolken, Pflanzen, etc.)
  // ========================================================================
  
  // Erstelle ein Canvas-Element (wie eine digitale Leinwand zum Zeichnen)
  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "0"; // Ganz hinten, hinter allem anderen
  playArea.prepend(canvas);
  
  // Hole das 2D-Zeichenwerkzeug
  const ctx = canvas.getContext ? canvas.getContext("2d") : null;

  // Funktion: Passe die Canvas-Größe zur Spielfläche an
  function resizeCanvas() {
    const w = playArea.offsetWidth;
    const h = playArea.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    if (ctx) drawBackground(); // Zeichne neu
  }
  
  // Wenn der Benutzer das Fenster resized, passe Canvas an
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Einmal am Anfang

  // Funktion: Zeichne den Hintergrund (Himmel, Gras, Wolken, etc.)
  function drawBackground() {
    if (!ctx) return; // Falls kein Canvas-Support, stoppe
    
    const w = canvas.width;
    const h = canvas.height;
    
    // Lösche alles was vorher war
    ctx.clearRect(0, 0, w, h);
    
    // Zeichne Himmel (oben)
    ctx.fillStyle = "#b7e3ff"; // Hellblaue Farbe
    ctx.fillRect(0, 0, w, Math.floor(h * 0.7)); // Rechteck oben 70% hoch
    
    // Zeichne Gras (unten)
    ctx.fillStyle = "#2e7d32"; // Grüne Farbe
    ctx.fillRect(0, Math.floor(h * 0.7), w, Math.ceil(h * 0.3)); // Rechteck unten 30% hoch
    
    // Zeichne Wolken
    ctx.fillStyle = "white";
    drawCloud(ctx, w * 0.2, h * 0.1, 60, 40);
    drawCloud(ctx, w * 0.5, h * 0.15, 80, 50);
    drawCloud(ctx, w * 0.8, h * 0.08, 50, 30);
    
    // Zeichne Pflanzen
    drawPlant(ctx, w * 0.1, h * 0.85, 20, 50);
    drawPlant(ctx, w * 0.3, h * 0.9, 15, 40);
    
    // Zeichne Pilze
    drawMushroom(ctx, w * 0.7, h * 0.88, 15, 20);
    drawMushroom(ctx, w * 0.85, h * 0.87, 20, 25);
  }

  // Funktion: Zeichne eine Wolke mit Ellipsen
  function drawCloud(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.5, y + 10, width * 0.7, height * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(x - width * 0.5, y + 10, width * 0.7, height * 0.7, 0, 0, Math.PI * 2);
    ctx.fill(); // Fülle mit der aktuellen Farbe (weiß)
  }
  
  // Funktion: Zeichne eine Pflanze mit Stiel und Blüte
  function drawPlant(ctx, x, y, width, height) {
    ctx.fillStyle = "#1b5e20"; // Dunkelgrüner Stiel
    ctx.fillRect(x - width / 8, y - height, width / 4, height);
    
    ctx.beginPath();
    ctx.arc(x, y - height, width / 2, 0, Math.PI * 2); // Kreis oben
    ctx.fillStyle = "#b973ffff"; // Lila Blüte
    ctx.fill();
  }
  
  // Funktion: Zeichne einen Pilz mit Hut und Stiel
  function drawMushroom(ctx, x, y, width, height) {
    ctx.fillStyle = "#fbe9e7"; // Heller Stiel
    ctx.fillRect(x - width / 4, y - height, width / 2, height);
    
    ctx.beginPath();
    ctx.arc(x, y - height, width, 0, Math.PI, true); // Halbkreis oben = Pilz-Hut
    ctx.fillStyle = "#d32f2f"; // Rot
    ctx.fill();
  }

  // ========================================================================
  // 17. DRAG & DROP FÜTTER-SYSTEM
  // ========================================================================
  
  // Diese IIFE (sofort ausgeführte Funktion) setzt das Fütter-System auf
  (function setupDragBurger() {
    // Finde den Fütter-Button
    const feedBtn = document.getElementById("feed");
    if (!feedBtn || !pet) return; // Falls nicht vorhanden, stoppe

    // Erstelle oder finde den draggbaren Burger
    let dragBurger = document.getElementById("dragging-burger");
    if (!dragBurger) {
      dragBurger = document.createElement("span");
      dragBurger.id = "dragging-burger";
      dragBurger.textContent = "🍔"; // Das Burger-Emoji
      
      // CSS für Burger während Drag
      Object.assign(dragBurger.style, {
        position: "absolute", // Kann überall auf dem Bildschirm sein
        cursor: "grab", // Cursor zeigt "greifbar"
        fontSize: "28px",
        display: "none", // Am Anfang versteckt
        zIndex: 9999, // Ganz vorne
        touchAction: "none" // Verhindere Browser-Gesten
      });
      document.body.appendChild(dragBurger);
    }

    // Verhindere Browser-Standardverhalten beim Drag
    feedBtn.style.touchAction = "none";

    let dragging = false; // Ist der Benutzer gerade beim Dragging?
    let offsetX = 0, offsetY = 0; // Versatz vom Mauszeiger zum Burger

    // Funktion: Bewege den Burger zur Mausposition
    function moveAt(clientX, clientY) {
      dragBurger.style.left = (clientX - offsetX + window.scrollX) + "px";
      dragBurger.style.top  = (clientY - offsetY + window.scrollY) + "px";
    }

    // Funktion: Starte das Dragging
    function startDrag(clientX, clientY) {
      const rect = dragBurger.getBoundingClientRect();
      offsetX = rect.width / 2;
      offsetY = rect.height / 2;
      dragBurger.style.display = "block"; // Zeige den Burger
      moveAt(clientX, clientY);
      dragging = true;
      
      // Höre auf Mausbewegungen
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    // Funktion: Wird aufgerufen wenn Maus sich bewegt während Drag
    function onPointerMove(e) {
      if (!dragging) return;
      e.preventDefault();
      moveAt(e.clientX, e.clientY);
    }

    // Funktion: Beende das Dragging und prüfe ob über Pet
    function endDrag(clientX, clientY) {
      dragging = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      // Hole die Positionen von Burger und Pet
      const bR = dragBurger.getBoundingClientRect();
      const pR = pet.getBoundingClientRect();
      
      // Prüfe ob Burger über Pet ist (Kollisionserkennung)
      const hit = !(bR.right < pR.left || bR.left > pR.right || 
                    bR.bottom < pR.top || bR.top > pR.bottom);

      if (hit) {
        // ===== ERFOLGREICH GEFÜTTERT! =====
        
        changeStat("hunger", 20); // +20 Hunger
        
        // Spiele Ess-Geräusch ab
        const eatSound = new Audio("assets/sound_eating.mp3");
        eatSound.play().catch(()=>{});
        
        // Animiere das Pet (Ess-Animation)
        if (pet.classList.contains("shown")) {
          pet.classList.add("eating"); // Starte CSS-Animation
          setTimeout(() => pet.classList.remove("eating"), 1000); // Nach 1 Sekunde weg
        }
      }
      
      dragBurger.style.display = "none"; // Verstecke Burger
    }

    // Event-Handler für Pointerup
    function onPointerUp(e) { endDrag(e.clientX, e.clientY); }

    // POINTER-EVENT (moderne Methode, funktioniert überall)
    feedBtn.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      const r = feedBtn.getBoundingClientRect();
      startDrag(r.left + r.width/2, r.top + r.height/2);
    });

    // TOUCH-FALLBACK (für ältere Browser)
    feedBtn.addEventListener("touchstart", (ev) => {
      ev.preventDefault();
      const t = ev.touches[0];
      startDrag(t.clientX, t.clientY);
    }, { passive: false });

    // Höre auf Touch-Bewegungen
    document.addEventListener("touchmove", (ev) => {
      if (!dragging) return;
      ev.preventDefault();
      const t = ev.touches[0];
      moveAt(t.clientX, t.clientY);
    }, { passive: false });

    // TOUCH-END
    document.addEventListener("touchend", (ev) => {
      if (!dragging) return;
      const t = ev.changedTouches[0];
      endDrag(t.clientX, t.clientY);
    });
  })();

  // ========================================================================
  // 18. PETTING-KNOPF (Streicheln = Glück)
  // ========================================================================
  
  const pettingBtn = document.getElementById("petting");
  if (pettingBtn && pet) {
    pettingBtn.addEventListener("click", () => {
      // Wenn das Pet angezeigt wird...
      if (pet.classList.contains("shown")) {
        // Spiele ein glückliches Geräusch ab
        const giggleSound = new Audio("assets/sound_giggle.mp3");
        giggleSound.play().catch(()=>{});
        
        // Bonus-Effekt: Gib Energie (weil das Pet glücklich ist)
        changeStat("energy", 10); // +10 Energie
      }
    });
  }

}); // Ende des DOMContentLoaded Event Listeners
