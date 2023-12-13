// define html elems
const gameBoard = document.getElementById('game-board');
const instructionTxt = document.getElementById('instructions');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreTxt = document.getElementById('highScore');

// define variables (defaults)
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// draw game map, snake, & food
function draw() {
  gameBoard.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElem = createGameElem('div', 'snake');

    setPosition(snakeElem, segment);

    gameBoard.appendChild(snakeElem);
  });
}

// create snake or food
function createGameElem(tag, className) {
  const elem = document.createElement(tag);
  elem.className = className;

  return elem;
}

// set position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// draw food
function drawFood() {
  if (gameStarted) {
    const foodElem = createGameElem('div', 'food');

    setPosition(foodElem, food);

    gameBoard.appendChild(foodElem);
  }
}

// random generation of food position
function generateFood() {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
}

// snake movement
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }

  snake.unshift(head);

  // if snake pos = food pos
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// -------------------------------------------------------------------

// main game function
function startGame() {
  gameStarted = true;
  instructionTxt.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// reset game
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
  const currentScore = snake.length - 1;

  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreTxt.textContent = highScore.toString().padStart(3, '0');
    highScoreTxt.style.display = 'block';
  }
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionTxt.style.display = 'block';
  logo.style.display = 'block';
}

// keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);
