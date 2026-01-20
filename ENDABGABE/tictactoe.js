/* ============================================================================
   TICTACTOE.JS - TIC TAC TOE SPIELLOGIK
   ============================================================================
   
   Dieses Script verwaltet:
   - Das TicTacToe-Spielbrett (3x3 Gitter)
   - Spieler vs Computer KI
   - Gewinn-Erkennung
   - Statistik (Siege zählen)
   - Zurück-Button
   
   ============================================================================ */

// ========================================================================
// 1. ELEMENTE FINDEN
// ========================================================================

// Finde alle 9 Spielfelder (die Quadrate im 3x3 Gitter)
const cells = document.querySelectorAll('.cell');

// Finde das Status-Text-Element (zeigt "Du bist am Zug" etc)
const statusDisplay = document.getElementById('status');

// Finde den "Neues Spiel"-Button
const resetBtn = document.getElementById('reset-btn');

// Finde den "Zurück"-Button (zur Hauptseite)
const backBtn = document.getElementById('back-btn');

// Finde die Textfelder für die Siege
const playerWinsDisplay = document.getElementById('player-wins');
const computerWinsDisplay = document.getElementById('computer-wins');

// ========================================================================
// 2. SPIELVARIABLEN (Der Spielzustand)
// ========================================================================

// Das Spielbrett - 9 Felder (oben links bis unten rechts)
// Jedes Feld ist entweder:
//   '' (leer)
//   'O' (der Spieler)
//   'X' (der Computer/Bär)
let board = ['', '', '', '', '', '', '', '', ''];

// Wer ist dran? Am Anfang der Spieler
let currentPlayer = 'O'; // O = Spieler (du), X = Computer (Bär)

// Spiel aktiv? Am Anfang ja
let gameActive = true;

// Zähle die Siege
let playerWins = 0;  // Wie oft hat der Spieler gewonnen?
let computerWins = 0; // Wie oft hat der Bär gewonnen?

// ========================================================================
// 3. GEWINN-BEDINGUNGEN (Alle 8 möglichen Gewinn-Linien)
// ========================================================================

// Ein Spieler gewinnt wenn er 3 in einer Reihe hat
// Horizontal (3 Reihen à 3 Felder):
//   [0, 1, 2] = obere Reihe
//   [3, 4, 5] = mittlere Reihe
//   [6, 7, 8] = untere Reihe
//
// Vertikal (3 Spalten à 3 Felder):
//   [0, 3, 6] = linke Spalte
//   [1, 4, 7] = mittlere Spalte
//   [2, 5, 8] = rechte Spalte
//
// Diagonal (2 Diagonalen):
//   [0, 4, 8] = von oben-links nach unten-rechts
//   [2, 4, 6] = von oben-rechts nach unten-links

const winningConditions = [
    [0, 1, 2], // Obere Reihe
    [3, 4, 5], // Mittlere Reihe
    [6, 7, 8], // Untere Reihe
    [0, 3, 6], // Linke Spalte
    [1, 4, 7], // Mittlere Spalte
    [2, 5, 8], // Rechte Spalte
    [0, 4, 8], // Diagonale von oben-links nach unten-rechts
    [2, 4, 6]  // Diagonale von oben-rechts nach unten-links
];

// ========================================================================
// 4. SPIELFELDER KLICKBAR MACHEN
// ========================================================================

// Gehe durch ALLE 9 Felder und mache sie klickbar
cells.forEach((cell, index) => {
    // Wenn jemand auf ein Feld klickt...
    cell.addEventListener('click', () => {
        // Prüfe mehrere Bedingungen:
        // 1. Das Feld ist leer (nicht schon besetzt)
        // 2. Das Spiel ist noch aktiv (nicht vorbei)
        // 3. Der Spieler ist dran (nicht der Computer)
        if (board[index] === '' && gameActive && currentPlayer === 'O') {
            
            // Setze ein 'O' auf dieses Feld
            board[index] = 'O';
            cell.textContent = 'O'; // Zeige 'O' auf dem Bildschirm
            cell.classList.add('taken'); // Markiere das Feld als besetzt (CSS-Klasse)
            
            // ===== PRÜFE OB DER SPIELER GEWONNEN HAT =====
            if (checkWinner()) {
                statusDisplay.textContent = '🎉 Du hast gewonnen!';
                playerWins++; // Erhöhe die Siege des Spielers um 1
                playerWinsDisplay.textContent = playerWins; // Update die Anzeige
                gameActive = false; // Beende das Spiel
                return; // Stoppe hier
            }
            
            // ===== PRÜFE OB DAS SPIEL UNENTSCHIEDEN IST =====
            if (checkDraw()) {
                statusDisplay.textContent = '🤝🏼 Unentschieden!';
                gameActive = false; // Beende das Spiel
                return; // Stoppe hier
            }
            
            // ===== JETZT IST DER COMPUTER DRAN =====
            currentPlayer = 'X'; // Wechsle zum Computer
            statusDisplay.textContent = '🐻 denkt nach...'; // Zeige Denk-Nachricht
            
            // Rufe die Computer-Funktion auf, aber mit 0,8 Sekunden Verzögerung
            // Das sieht natürlicher aus, als wenn der Computer sofort antwortet
            setTimeout(computerMove, 800);
        }
    });
});

// ========================================================================
// 5. COMPUTER-ZÜGKE (KI DES BÄREN)
// ========================================================================

// Funktion: Der Computer macht einen Zug
function computerMove() {
    // Falls das Spiel nicht aktiv ist, tu nichts
    if (!gameActive) return;
    
    // ===== FINDE ALLE LEEREN FELDER =====
    // Das sind die Felder wo noch ein Zug möglich ist
    const availableMoves = board
        .map((cell, index) => cell === '' ? index : null) // Wenn leer, gib Index zurück, sonst null
        .filter(val => val !== null); // Entferne alle null-Werte
    
    // Falls keine leeren Felder mehr, stoppe
    if (availableMoves.length === 0) return;
    
    // ===== WÄHLE EINEN ZUFÄLLIGEN ZUG =====
    // Die KI ist einfach: Sie wählt ZUFÄLLIG aus den freien Feldern
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const moveIndex = availableMoves[randomIndex];
    
    // Setze ein 'X' auf das gewählte Feld
    board[moveIndex] = 'X';
    cells[moveIndex].textContent = 'X'; // Zeige 'X' auf dem Bildschirm
    cells[moveIndex].classList.add('taken'); // Markiere das Feld als besetzt
    
    // ===== PRÜFE OB DER COMPUTER GEWONNEN HAT =====
    if (checkWinner()) {
        statusDisplay.textContent = '🐻 hat gewonnen!';
        computerWins++; // Erhöhe die Siege des Computers um 1
        computerWinsDisplay.textContent = computerWins; // Update die Anzeige
        gameActive = false; // Beende das Spiel
        return; // Stoppe hier
    }
    
    // ===== PRÜFE OB DAS SPIEL UNENTSCHIEDEN IST =====
    if (checkDraw()) {
        statusDisplay.textContent = '🤝🏼 Unentschieden!';
        gameActive = false; // Beende das Spiel
        return; // Stoppe hier
    }
    
    // ===== JETZT IST DER SPIELER WIEDER DRAN =====
    currentPlayer = 'O'; // Wechsle zum Spieler
    statusDisplay.textContent = 'Du bist am Zug'; // Zeige das auf dem Bildschirm
}

// ========================================================================
// 6. GEWINN-PRÜFUNG
// ========================================================================

// Funktion: Prüfe ob jemand gewonnen hat
function checkWinner() {
    // Gehe durch ALLE 8 möglichen Gewinn-Kombinationen
    for (let condition of winningConditions) {
        // Destrukturiere: hole 3 Feldindizes aus der Kombination
        const [a, b, c] = condition;
        
        // Prüfe: 
        // 1. board[a] ist nicht leer (existiert ein Zeichen?)
        // 2. board[a] === board[b] (sind die Zeichen gleich?)
        // 3. board[a] === board[c] (sind alle 3 gleich?)
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true; // Ja! Es gibt einen Gewinner!
        }
    }
    return false; // Nein, noch kein Gewinner
}

// ========================================================================
// 7. UNENTSCHIEDEN-PRÜFUNG
// ========================================================================

// Funktion: Prüfe ob das Spiel unentschieden ist
function checkDraw() {
    // Prüfe: Ist JEDES Feld auf dem Brett besetzt?
    // .every() gibt true zurück wenn ALLE Elemente die Bedingung erfüllen
    return board.every(cell => cell !== '');
    // D.h. jedes cell ist nicht leer
}

// ========================================================================
// 8. SPIEL ZURÜCKSETZEN
// ========================================================================

// Funktion: Setze das Spiel auf den Anfang zurück
function resetGame() {
    // Leere alle Felder
    board = ['', '', '', '', '', '', '', '', ''];
    
    // Der Spieler fängt an
    currentPlayer = 'O';
    
    // Spiel ist aktiv
    gameActive = true;
    
    // Update Status-Text
    statusDisplay.textContent = 'Du bist am Zug';
    
    // Gehe durch alle visuellen Felder und leere sie
    cells.forEach(cell => {
        cell.textContent = ''; // Entferne O oder X
        cell.classList.remove('taken'); // Entferne CSS-Klasse
    });
}

// ========================================================================
// 9. NEUES SPIEL-BUTTON
// ========================================================================

// Wenn der Benutzer auf "Neues Spiel" klickt, reset das Spiel
resetBtn.addEventListener('click', resetGame);

// ========================================================================
// 10. ZURÜCK-BUTTON (Gehe zur Hauptseite)
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

/* ============================================================================
   ZUSAMMENFASSUNG DES SPIELS:
   
   1. Spieler klickt auf ein leeres Feld → Setzt 'O'
   2. Prüfe ob Spieler gewonnen hat → Falls ja, Spiel Ende
   3. Prüfe ob Unentschieden → Falls ja, Spiel Ende
   4. Computer macht Zug → Setzt zufällig 'X'
   5. Prüfe ob Computer gewonnen hat → Falls ja, Spiel Ende
   6. Prüfe ob Unentschieden → Falls ja, Spiel Ende
   7. Zurück zum Schritt 1
   
   ============================================================================ */
