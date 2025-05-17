let buttonColors = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;

// Detect if on mobile device
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    navigator.userAgent
  );
}

// Start game: keydown for desktop, tap anywhere for mobile
function setupGameStartListener() {
  if (isMobile()) {
    $(document).on('touchstart.gameStart', function () {
      if (!started) {
        resetGame();
        started = true;
        $(document).off('touchstart.gameStart');
      }
    });
  } else {
    $(document).on('keydown.gameStart', function () {
      if (!started) {
        resetGame();
        started = true;
        $(document).off('keydown.gameStart');
      }
    });
  }
}

// Call this on page load and after game over
setupGameStartListener();

function activateButtons() {
  if (isMobile()) {
    $('.btn')
      .off('touchstart')
      .on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent touch from bubbling to document
        let userChosenColor = $(this).attr('id');
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animatePress(userChosenColor);
        checkAnswer(userClickedPattern.length - 1);
      });
  } else {
    $('.btn')
      .off('click')
      .on('click', function (e) {
        let userChosenColor = $(this).attr('id');
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animatePress(userChosenColor);
        checkAnswer(userClickedPattern.length - 1);
      });
  }
}

function deactivateButtons() {
  $('.btn').off('click touchstart');
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $('#level-title').text(`Level ${level}`);
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  $(`#${randomChosenColor}`).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);
}

function playSound(name) {
  let audio = new Audio(`./assets/sounds/${name}.mp3`);
  audio.play();
}

function animatePress(currentColor) {
  $(`#${currentColor}`).addClass('pressed');
  setTimeout(function () {
    $(`#${currentColor}`).removeClass('pressed');
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  playSound('wrong');
  $('body').addClass('game-over');
  const restartMsg = isMobile()
    ? 'Game Over<br><span style="font-size:1.2em;">Tap Anywhere to Restart</span>'
    : 'Game Over<br><span style="font-size:1.2em;">Press Any Key to Restart</span>';
  $('#level-title').html(restartMsg); // Use .html() to allow line break
  setTimeout(function () {
    $('body').removeClass('game-over');
    // Delay re-enabling start listener so message is visible
    started = false;
    setupGameStartListener();
  }, 600); // Increased delay for better visibility
  deactivateButtons();
}

function resetGame() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  activateButtons();
  nextSequence();
}
