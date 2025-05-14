//*****VARIABLES*****
let buttonColors = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;

$(document).keydown(function () {
  if (!started) {
    resetGame();
  }
});
//*****ACTIVATE ALL BUTTONS*****
function activateButtons() {
  $('.btn').on('click', function () {
    let userChosenColor = $(this).attr('id');
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  });
}
//*****DEACTIVATE BUTTONS*****
function deactivateButtons() {
  $('.btn').off('click');
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
//*****ANIMATE ON CLICK*****
function animatePress(currentColor) {
  $(`#${currentColor}`).addClass('pressed');
  setTimeout(function () {
    $(`#${currentColor}`).removeClass('pressed');
  }, 100);
}
//*****CHECK USER ANSWER*****
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
//*****GAME OVER*****
function gameOver() {
  playSound('wrong');
  $('body').addClass('game-over');
  $('#level-title').text('Game Over, Press Any Key to Restart');
  setTimeout(function () {
    $('body').removeClass('game-over');
  }, 200);
  deactivateButtons();
  started = false;
}
//*****RESET GAME*****
function resetGame() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = true;
  $('#level-title').text(`Level ${level}`);
  activateButtons();
  nextSequence();
}
