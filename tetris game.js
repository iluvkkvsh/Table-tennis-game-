// tetris.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the grid dimensions
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
let grid = [];

// Define the tetromino shapes
const tetrominoes = [
  { color: "cyan", shape: [[1, 1, 1, 1]] }, // I
  { color: "yellow", shape: [[1, 1], [1, 1]] }, // O
  { color: "purple", shape: [[0, 1, 0], [1, 1, 1]] }, // T
  { color: "green", shape: [[0, 1, 1], [1, 1, 0]] }, // S
  { color: "red", shape: [[1, 1, 0], [0, 1, 1]] }, // Z
  { color: "blue", shape: [[1, 0, 0], [1, 1, 1]] }, // J
  { color: "orange", shape: [[0, 0, 1], [1, 1, 1]] } // L
];

let currentTetromino;
let currentPos = { x: 4, y: 0 }; // Start position for new tetromino
let gameInterval;
let gamePaused = false;
let score = 0;

// Initialize the grid
function initializeGrid() {
  grid = [];
  for (let row = 0; row < ROWS; row++) {
    grid[row] = Array(COLS).fill(null);
  }
}

// Draw the grid
function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const block = grid[row][col];
      if (block) {
        ctx.fillStyle = block;
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "#1c1c1c";
        ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Generate a random tetromino
function randomTetromino() {
  const randomIndex = Math.floor(Math.random() * tetrominoes.length);
  return tetrominoes[randomIndex];
}

// Draw the current tetromino
function drawTetromino() {
  const shape = currentTetromino.shape;
  ctx.fillStyle = currentTetromino.color;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        ctx.fillRect((currentPos.x + col) * BLOCK_SIZE, (currentPos.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "#1c1c1c";
        ctx.strokeRect((currentPos.x + col) * BLOCK_SIZE, (currentPos.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Move the tetromino down
function moveTetrominoDown() {
  if (isValidMove(0, 1, currentTetromino)) {
    currentPos.y++;
  } else {
    placeTetromino();
    clearLines();
    currentTetromino = randomTetromino();
    currentPos = { x: 4, y: 0 };
    if (!isValidMove(0, 0, currentTetromino)) {
      // Game Over
      clearInterval(gameInterval);
      alert("Game Over");
    }
  }
}

// Check if the tetromino is in a valid position
function isValidMove(dx, dy, tetromino) {
  const shape = tetromino.shape;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = currentPos.x + col + dx;
        const newY = currentPos.y + row + dy;
        if (newX < 0 || newX >= COLS || newY >= ROWS || grid[newY] && grid[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}

// Place the current tetromino on the grid
function placeTetromino() {
  const shape = currentTetromino.shape;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        grid[currentPos.y + row][currentPos.x + col] = currentTetromino.color;
      }
    }
  }
}

// Clear full lines and update the score
function clearLines() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (grid[row].every(cell => cell)) {
      grid.splice(row, 1);
      grid.unshift(Array(COLS).fill(null));
      score += 100;
      document.getElementById("score").innerText = `Score: ${score}`;
    }
  }
}

// Start the game
function startGame() {
  initializeGrid();
  currentTetromino = randomTetromino();
  gameInterval = setInterval(() => {
    if (!gamePaused) {
      moveTetrominoDown();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawTetromino();
    }
  }, 500); // Update every 500ms
}

// Handle key events
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    if (isValidMove(-1, 0, currentTetromino)) {
      currentPos.x--;
    }
  } else if (event.key === "ArrowRight") {
    if (isValidMove(1, 0, currentTetromino)) {
      currentPos.x++;
    }
  } else if (event.key === "ArrowDown") {
    if (isValidMove(0, 1, currentTetromino)) {
      currentPos.y++;
    }
  } else if (event.key === "ArrowUp") {
    const rotatedTetromino = rotateTetromino(currentTetromino);
    if (isValidMove(0, 0, rotatedTetromino)) {
      currentTetromino = rotatedTetromino;
    }
  }
});

// Rotate the tetromino
function rotateTetromino(tetromino) {
  const newShape = tetromino.shape[0].map((_, index) =>
    tetromino.shape.map(row => row[index])
  );
  return { ...tetromino, shape: newShape };
}

// Pause the game
document.getElementById("pauseBtn").addEventListener("click", () => {
  gamePaused = !gamePaused;
  document.getElementById("pauseBtn").textContent = gamePaused ? "Resume" : "Pause";
});

// Start the game on load
startGame();
