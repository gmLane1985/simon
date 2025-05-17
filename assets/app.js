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
  $('.btn')
    .off('click touchstart')
    .on('click touchstart', function (e) {
      // Prevent both click and touchstart from firing
      e.preventDefault();
      let userChosenColor = $(this).attr('id');
      userClickedPattern.push(userChosenColor);
      playSound(userChosenColor);
      animatePress(userChosenColor);
      checkAnswer(userClickedPattern.length - 1);
    });
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
  $('#level-title').text('Game Over, Push any key or tap anywhere to Restart');
  setTimeout(function () {
    $('body').removeClass('game-over');
  }, 200);
  deactivateButtons();
  started = false;
  setupGameStartListener();
}

function resetGame() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  $('#level-title').text(`Level ${level}`);
  activateButtons();
  nextSequence();
}
