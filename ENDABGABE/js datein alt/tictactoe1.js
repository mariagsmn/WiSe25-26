const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const backBtn = document.getElementById('back-btn');
const playerWinsDisplay = document.getElementById('player-wins');
const computerWinsDisplay = document.getElementById('computer-wins');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'O'; // Spieler ist O
let gameActive = true; 
let playerWins = 0;
let computerWins = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Event Listener für Spielfelder
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (board[index] === '' && gameActive && currentPlayer === 'O') {
            board[index] = 'O';
            cell.textContent = 'O';
            cell.classList.add('taken');
            
            if (checkWinner()) {
                statusDisplay.textContent = '🎉 Du hast gewonnen!';
                playerWins++;
                playerWinsDisplay.textContent = playerWins;
                gameActive = false;
                return;
            }
            
            if (checkDraw()) {
                statusDisplay.textContent = '🤝🏼 Unentschieden!';
                gameActive = false;
                return;
            }
            
            currentPlayer = 'X';
            statusDisplay.textContent = '🐻 denkt nach...';
            
            // Das "Tier" macht seinen Zug nach kurzer Verzögerung
            setTimeout(computerMove, 800);
        }
    });
});

function computerMove() {
    if (!gameActive) return;
    
    // Finde alle leeren Felder
    const availableMoves = board
        .map((cell, index) => cell === '' ? index : null)
        .filter(val => val !== null);
    
    if (availableMoves.length === 0) return;
    
    // "Tier" wählt einen zufälligen Zug
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const moveIndex = availableMoves[randomIndex];
    
    board[moveIndex] = 'X';
    cells[moveIndex].textContent = 'X';
    cells[moveIndex].classList.add('taken');
    
    if (checkWinner()) {
        statusDisplay.textContent = '🐻 hat gewonnen!';
        computerWins++;
        computerWinsDisplay.textContent = computerWins;
        gameActive = false;
        return;
    }
    
    if (checkDraw()) {
        statusDisplay.textContent = '🤝🏼 Unentschieden!';
        gameActive = false;
        return;
    }
    
    currentPlayer = 'O';
    statusDisplay.textContent = 'Du bist am Zug';
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'O';
    gameActive = true;
    statusDisplay.textContent = 'Du bist am Zug';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

resetBtn.addEventListener('click', resetGame);

// Back Button - Navigate back to room.html with sidebars already loaded
if (backBtn) {
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Set flags so room.html loads with sidebars visible immediately
        sessionStorage.setItem('skipEggAnimation', '1');
        sessionStorage.setItem('jumpTo', 'sidebarsLoaded');
        window.location.href = 'room.html';
    });
}