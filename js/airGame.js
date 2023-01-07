export default function airGame() {
  const content = document.querySelector(".screenGame");

  const modalInitGame = document.querySelector(".initGame");
  const btnInit = document.querySelector(".initGame button");

  const airPlayer = document.querySelector(".airPlayer");
  let coinContent = document.querySelectorAll(".coin");

  const imgHelicopter = document.querySelector(".airPlayer img");
  const coinElement = document.querySelector(".quantMoedas");

  if (airPlayer && coinContent.length) {
    let coins = 0;

    const screenWidth = content.clientWidth;
    const screenHeight = content.clientHeight;

    let intervalos = [];

    let x = 0;
    let y = 0;
    let arr = [];

    function initGame() {
      moveAir();
      modalInitGame.classList.add("close");
    }

    btnInit.addEventListener("click", initGame);

    function generateRandomLocations() {
      const randomLocals = {
        right: `${
          Math.floor(Math.random() * (screenWidth - 100) + 100) - 34
        }px`,
        top: `${Math.floor(Math.random() * (screenHeight - 100) + 100) - 34}px`,
      };
      return {
        locals: randomLocals,
        arrLocals: arr,
      };
    }

    function getRandomLocals() {
      let intervalo = setInterval(() => {
        arr.push(generateRandomLocations().locals);
        console.log(arr);
        if (arr.length === 2) {
          clearInterval(intervalo);
        }
      }, 1);
    }
    getRandomLocals();

    const velocity = {
      velocityX: x,
      velocityY: y,
    };

    const displacement = {
      deslocX: 0,
      deslocY: 0,
      scale: 1,
    };

    let localsCoins;

    function verifyColissions(velocityX, coordX, velocityY, coordY, val1) {
      if (
        velocityX + val1 >= +coordX &&
        velocityX - val1 < +coordX &&
        velocityY + val1 >= +coordY &&
        velocityY < +coordY + val1
      ) {
        return true;
      }
    }

    function applicationCordsInCoins() {
      localsCoins = generateRandomLocations().arrLocals;

      setTimeout(() => {
        localsCoins.forEach((cord, i) => {
          coinContent[i].style.left = cord.right;
          coinContent[i].style.top = cord.top;
        });
      }, 100);
    }

    applicationCordsInCoins();

    function moveAir() {
      window.addEventListener("keydown", move);
      window.addEventListener("keyup", moveUp);

      function initFramesAndColissions() {
        enterFrame();
        localsCoins.forEach((item) => {
          checkForCollision(item);
        });
      }

      let intervalFrames = setInterval(initFramesAndColissions, 10);
      intervalos.push(intervalFrames);
    }

    function move({ key }) {
      if (key === "d") {
        displacement.deslocX = 1;
        velocity.velocityX += 5;
        displacement.scale = -1;
      }
      if (key === "s") {
        displacement.deslocY = 1;
        velocity.velocityY += 5;
      }
      if (key === "w") {
        displacement.deslocY = -1;
        velocity.velocityY += -5;
      }
      if (key === "a") {
        displacement.deslocX = -1;
        velocity.velocityX += -5;
        displacement.scale = 1;
      }
    }

    function moveUp({ key }) {
      if (key === "d" || key === "a") {
        displacement.deslocX = 0;
      }
      if (key === "s" || key === "w") {
        displacement.deslocY = 0;
      }
    }

    function enterFrame() {
      let run = 2;
      velocity.velocityX += displacement.deslocX * run;
      velocity.velocityY += displacement.deslocY * run;
      airPlayer.style.transform = `translate3d(${velocity.velocityX}px, ${velocity.velocityY}px, 0px)`;
      imgHelicopter.style.transform = `scaleX(${displacement.scale})`;
      if (velocity.velocityX > screenWidth - 34 || velocity.velocityX < 0) {
        velocity.velocityX = 0;
      }
      if (velocity.velocityY > screenHeight - 24 || velocity.velocityY < 0) {
        velocity.velocityY = 0;
      }
    }

    function checkForCollision(coordsCoin) {
      let { right: coordX, top: coordY } = coordsCoin;
      let { velocityX, velocityY } = velocity;

      coordX = coordX.replace("px", "");
      coordY = coordY.replace("px", "");

      if (verifyColissions(velocityX, coordX, velocityY, coordY, 24)) {
        coinContent.forEach((item) => {
          if (item.style.left === coordsCoin.right) {
            item.style.display = "none";
            coins++;
            contCoins();
            if (coins === 30) winGame();
            if (content.contains(item)) {
              content.removeChild(item);
            }
          }
        });
      }

      coinContent = document.querySelectorAll(".coin");

      function addRandomCoins() {
        arr.splice(0, 2);
        const newCoin = document.createElement("div");
        const pictureItem = document.createElement("picture");
        pictureItem.innerHTML = `<img src="../imgs/gameImgs/coin.png" alt="">`;
        newCoin.appendChild(pictureItem);
        newCoin.classList.add("coin");
        content.appendChild(newCoin);
        coinContent = document.querySelectorAll(".coin");
        generateRandomLocations();
        getRandomLocals();
        applicationCordsInCoins();
      }
      while (coinContent.length != 2) {
        addRandomCoins();
        break;
      }
    }

    function contCoins() {
      coinElement.innerText = coins;
    }

    function removeEvents() {
      for (let intervalosID of intervalos) {
        clearInterval(intervalosID);
        cancelAnimationFrame(intervalosID);
      }

      window.removeEventListener("keydown", move);
      window.removeEventListener("keyup", moveUp);
    }

    function winGame() {
      const contentwinGame = document.querySelector(".reset");
      const elementTitle = document.querySelector(".reset h1");
      const elementSubtitle = document.querySelector(".motivo_over");
      const btnReset = document.querySelector(".resetGame");

      removeEvents();

      elementTitle.innerText = "Você venceu!";
      elementSubtitle.innerText = "Parabéns, conseguiu coletar as 30 moedas";

      contentwinGame.classList.add("active");
      btnReset.addEventListener("click", () => {
        window.location.reload();
      });
    }
  }
}
