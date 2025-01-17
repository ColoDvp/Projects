const cells = document.querySelectorAll('.cell');
const titleHeader = document.querySelector('#titleHeader');
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const restartBtn = document.querySelector('#restartBtn')

// Inicializar variables para el juego
let player = 'X';
let isPauseGame = false;
let isGameStart = false;

// Arreglo de win conditions
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', ''];

// Arreglo de win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
]

// Agregar click event listener a cada celda
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index));
})

function tapCell(cell, index) {
    // Si el juego no ha iniciado, no hacer nada
    if (cell.textContent == '' && 
        !isPauseGame
    ) {
        isGameStart = true
        updateCell(cell, index);

        // Hace un pick random si no hay resultados
        if (!checkWinner()) {
            changePlayer()
            randomPick()
        }
    }
}

function updateCell(cell, index) {
    // Actualizar el valor de la celda
    cell.textContent = player;
    inputCells[index] = player;
    cell.style.color = (player == 'X') ? '#1892EA' : '#A737FF'
}

function changePlayer() {
    player = (player == 'X') ? 'O' : 'X'
}

function randomPick() {
    // Pausa el juego para permitir a la computadora elegir
    isPauseGame = true

    setTimeout(() => {
        let randomIndex
        do {
            // Escoge un número random entre 0 y 8
            randomIndex = Math.floor(Math.random() * inputCells.length)
        } while (
            // Se asegura que la celda esté vacia
            inputCells[randomIndex] != ''
        )

        // Actualiza la celda
        updateCell(cells[randomIndex], randomIndex, player)
        // Chequea si hay un ganador
        if (!checkWinner()) {
            changePlayer()
            // Reanuda el juego
            isPauseGame = false
            return;
        }
        player = (player == 'X') ? 'O' : 'X'
    }, 1000) // 1 segundo de pausa antes de que la computadora elija
}

function checkWinner() {
    for (const [a, b, c] of winConditions) {
        // Chequea cada condición ganadora
        if (inputCells[a] == player &&
            inputCells[b] == player &&
            inputCells[c] == player
        ) {
            declareWinner([a, b, c])
            return true;
        }
    }

    // Chequea si hay empate (no hay celdas vacías)
    if (inputCells.every(cell => cell != '')) {
        declareDraw()
        return true;
    }
}

function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Win`
    isPauseGame = true

    // Refleja las celdas ganadoras
    winningIndices.forEach((index) =>
        cells[index].style.background = '#2A2343'
    );

    restartBtn.style.visibility = 'visible'
}

function declareDraw() {
    titleHeader.textContent = 'Draw!'
    isPauseGame = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer) {
    // Si el juego no ha iniciado, cambiar el jugador
    if (!isGameStart) {
        player = selectedPlayer
        if (player == 'X') {
            // Ilumina el jugador actual (en este caso X)
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            // Ilumina el jugador actual (en este caso O)
            oPlayerDisplay.classList.add('player-active')
            xPlayerDisplay.classList.remove('player-active')
        }
    }
}

restartBtn.addEventListener('click', () => {
    // Reiniciar el juego
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '';
    });
    isPauseGame = false;
    isGameStart = false;
    titleHeader.textContent = 'Choose'
})

