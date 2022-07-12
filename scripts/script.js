let lives = 6;
const preview = document.querySelector("preview");
const hint = document.getElementById("hint");
const guessTable = document.getElementsByClassName("guess");
const btnHint = document.getElementById("btn-hint");
const letters = document.getElementsByName("btns");
const portrait = document.getElementById("portrait");
const btnRefresh = document.getElementById("refresh");
const overlayGame = document.getElementById("text");
const overlay = document.getElementById("overlay");
const bigContainer = document.getElementById("big-container");
const playAgain = document.getElementById("playAgain");

// Defining Sounds
const hoverSound = new Audio("./sounds/hangmanHover.wav");
const correctChoice = new Audio("./sounds/correctChoice.mp3");
const wrongChoice = new Audio("./sounds/wrongChoice.mp3");
const gameOver = new Audio("./sounds/gameOver.mp3");
const clickSound = new Audio("./sounds/Click.wav");
hoverSound.playbackRate = 3;

//set the default image
portrait.innerHTML = `<img src="./images/default.jpg" alt="" class="m-auto" style="height: 200px ; ">`;

const btnContainer = document.getElementById("btn-container");
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
for ([i, letter] of Object.entries(alphabet)) {
  btnContainer.innerHTML += `<button type="button" id="btn${i}" name = "btns" class="alph-btn col-lg-1 mx-2 my-3 col-md-4 btn btn-secondary fs-4" style= "width: 65px; ">${letter}</button>`;
}

var word = [];
let hintword = "";
let winCount = 0;
const fetchWord = () => {
  return fetch("https://random-word-api.herokuapp.com/word?number=1")
    .then((word) => word.json())
    .then((randomWord) => {
      console.log(`Inspect and Cheat: ${randomWord}`);
      word = randomWord[0].split("");
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${randomWord}`)
        .then((response) => {
          if (!response.ok) {
            hintword =
              "No Available Hint for The current word, You are on your own now :(";
            throw new Error(
              `No Available Hint for The current word, You are on your own now :(`
            );
          }
          return response.json();
        })
        .then((arr) => {
          var def = arr[0]?.meanings[0].definitions["0"].definition;
          hintword = `Hint: ${def}`;
        });
    });
};

btnHint.addEventListener("click", () => {
  clickSound.play();
  hint.innerHTML = hintword;
});

result = function () {
  wordHolder = document.getElementsByClassName("preview")[0];
  correct = document.createElement("ul");
  correct.style.width = "100%";
  correct.style.textAlign = "center";
  correct.setAttribute("class", "preview d-flex justify-content-center");
  for (var i = 0; i < word.length; i++) {
    correct.setAttribute("id", "my-word");
    guess = document.createElement("li");
    guess.setAttribute("class", "guess");

    guess.innerHTML = "_";

    wordHolder.appendChild(correct);
    correct.appendChild(guess);
  }
  // Handle the Click on the Alphabet Buttons.
  letters.forEach((e) => {
    e.addEventListener("mouseover", () => {
      hoverSound.play();
    });
    e.addEventListener("click", (e) => {
      e.target.setAttribute("disabled", "disabled");
      let indices = [];
      let letter = e.target.innerText.toLowerCase();
      if (word.includes(letter)) {
        correctChoice.play();
        let letterIndex = word.indexOf(letter);
        while (letterIndex != -1) {
          indices.push(letterIndex);
          letterIndex = word.indexOf(letter, letterIndex + 1);
        }
        for (index of indices) {
          guessTable[index].innerHTML = letter.toUpperCase();
          winCount++;
        }
        updateLives();
      } else {
        wrongChoice.play();
        lives--;
        if (lives >= 0) {
          updateImage();
        }
      }
      updateLives();
    });
  });
};

//counts number of lives remaining:

const updateLives = () => {
  livesCounter = document.getElementById("lives");
  if (lives >= 0) {
    livesCounter.innerHTML = `<img src="./images/heart.png"> Lives Remaining: ${lives}`;
  }

  if (lives < 1) {
    gameOver.play();
    on();
    overlayGame.innerHTML = "Game Over 🔥";
    document.querySelectorAll(".alph-btn").forEach((letter) => {
      letter.setAttribute("disabled", "disabled");
    });
  }
  for (let i = 0; i < guessTable.length; i++) {
    if (guessTable[i].innerHTML === "_") {
      continue;
    }
  }
  if (winCount === guessTable.length) {
    overlayGame.innerHTML = "You Win! 🙃 ";

    on();
    document.querySelectorAll(".alph-btn").forEach((letter) => {
      letter.setAttribute("disabled", "disabled");
    });
  }
};

async function startGame() {
  const loadWord = await fetchWord();

  await result();
}

function updateImage() {
  portrait.innerHTML = `<img src="./images/${lives}.jpg" alt="" class="" style="height: 200px; width: 200px;">`;
}

function on() {
  overlay.style.display = "block";
  bigContainer.style.display = "none";
}

function off() {
  overlay.style.display = "none";
  gameOver.pause();
  gameOver.currentTime = 0;
  bigContainer.style.display = "block";
}

startGame();
