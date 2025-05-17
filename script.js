// 1. Game Initialization
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const winMessage = document.getElementById('winMessage');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let timer = 0;
let timerInterval;

// 2. Card Data and Creation
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const cardData = [...emojis, ...emojis]; // Duplicate for pairs

function createCards() {
  // Shuffle cards using Fisher-Yates algorithm
  for (let i = cardData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
  }

  // Create card elements
  gameBoard.innerHTML = '';
  cardData.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    
    card.innerHTML = `
      <div class="card-face card-front">${emoji}</div>
      <div class="card-face card-back"></div>
    `;
    
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });

  cards = document.querySelectorAll('.card');
}

// 3. Game Logic
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!hasFlippedCard) {
    // First card flip
    hasFlippedCard = true;
    firstCard = this;
    startTimer();
    return;
  }

  // Second card flip
  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  
  resetBoard();
  checkWin();
}

function unflipCards() {
  lockBoard = true;
  
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// 4. Timer and Game Controls
function startTimer() {
  if (timer === 0) {
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
}

function checkWin() {
  const flippedCards = document.querySelectorAll('.flipped');
  if (flippedCards.length === cardData.length) {
    stopTimer();
    finalMoves.textContent = moves;
    finalTime.textContent = timer;
    winMessage.classList.add('show');
  }
}

function resetGame() {
  stopTimer();
  moves = 0;
  timer = 0;
  movesDisplay.textContent = '0';
  timerDisplay.textContent = '0';
  winMessage.classList.remove('show');
  createCards();
}

restartBtn.addEventListener('click', resetGame);

// 5. Initialize Game
// Start the game when page loads
createCards();