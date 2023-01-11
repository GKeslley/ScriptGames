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

    let alienY = 0;
    let alienX = 0;

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

    const cordShots = {
      left: false,
      right: false,
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
      createEnemys();
    }

    function move({ key }) {
      if (key === "d") {
        displacement.deslocX = 1;
        velocity.velocityX += 5;
        cordShots.right = false;
        cordShots.left = true;
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
        cordShots.right = true;
        cordShots.left = false;
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

      if (key === "f") {
        shotsInScreen();
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

      function addRandomLocationsDrone() {
        const drones = document.querySelectorAll(".drone");

        const coordsDrones = [...drones].map((element) => {
          return [
            +element.style.top.replace("px", ""),
            +element.style.left.replace("px", ""),
          ];
        });

        coordsDrones.forEach((item) => {
          if (verifyColissions(velocityX, +item[1], velocityY, +item[0], 24)) {
            verifyIfColissionDrone(true);
          }
        });
      }

      addRandomLocationsDrone();

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

    function shotsInScreen() {
      const localAir = `translate3d(${velocity.velocityX}px, ${velocity.velocityY}px, 0px)`;
      let airY = velocity.velocityY;
      let airX = velocity.velocityX;

      const fireAir = document.querySelector(".fire");

      if (airPlayer.contains(fireAir)) {
        airPlayer.removeChild(fireAir);
      }

      const bullet = document.createElement("span");
      bullet.classList.add("fire");
      content.appendChild(bullet);
      bullet.style.transform = localAir;
      bullet.style.top = 12 + "px";
      bullet.style.left = 0 + "px";

      if (cordShots.right) {
        bullet.classList.add("right");
      } else if (cordShots.left) {
        bullet.classList.add("left");
      }

      let leftShot = 0;

      function gun() {
        const dronesInScreen = document.querySelectorAll(".drone");
        if (bullet.classList.contains("right")) {
          bullet.style.left = `-${leftShot++}px`;
        } else if (bullet.classList.contains("left")) {
          bullet.style.transform = `translate3d(${airX++}px, ${airY}px, 0px)`;
        }

        if (airX > screenWidth - 50 || airX - leftShot < 5) {
          bullet.style.display = "none";
          if (content.contains(bullet)) {
            content.removeChild(bullet);
          }
        }
        if (dronesInScreen.length) {
          const coordsDrones = [...dronesInScreen].map((element) => {
            return [
              +element.style.top.replace("px", ""),
              +element.style.left.replace("px", ""),
            ];
          });

          coordsDrones.forEach((item, i) => {
            const deletDrone = () => {
              if (
                content.contains(dronesInScreen[coordsDrones.indexOf(item)])
              ) {
                [...dronesInScreen].splice(coordsDrones.indexOf(item), 1);
                content.removeChild(dronesInScreen[coordsDrones.indexOf(item)]);
              }
            };

            if (
              Math.abs(airX - leftShot) > item[1] &&
              Math.abs(airX - leftShot) < item[1] + 20 &&
              airY + 10 > item[0] &&
              airY < item[0] + 20
            ) {
              deletDrone();
            }

            if (
              airX > item[1] &&
              airX < item[1] + 20 &&
              airY + 10 > item[0] &&
              airY < item[0] + 20
            ) {
              deletDrone();
            }
          });
        }
      }

      let intervalGun = setInterval(gun, 1);
      intervalos.push(intervalGun);
    }

    function createEnemys() {
      let airAlien = document.querySelectorAll(".alienEnemy");
      airAlien.forEach((element) => {
        element.style.top = generateRandomLocations().locals.top;
      });

      function addNewMissels() {
        const createDrone = document.createElement("div");
        const imgDrone = document.createElement("img");

        createDrone.classList.add("drone");
        createDrone.appendChild(imgDrone);
        imgDrone.src = "../imgs/gameImgs/drone.png";
        content.appendChild(createDrone);

        let droneDiv = document.querySelectorAll(".drone");

        for (let index = 0; index < droneDiv.length; index++) {
          const element = droneDiv[index];
          const topRandom =
            +generateRandomLocations().locals.top.replace("px", "") - 50;
          const leftRandom =
            +generateRandomLocations().locals.right.replace("px", "") - 50;
          element.style.top = topRandom + "px";
          element.style.left = leftRandom + "px";
          console.log(screenWidth);
        }

        function initBomb() {
          droneDiv = document.querySelectorAll(".drone");

          console.log(droneDiv);

          const bomba = document.querySelectorAll(".bomba");

          if (droneDiv.length) {
            bomba.forEach((element) => {
              element.classList.add("on");
              element.style.display = "block";

              if (element.classList.contains("on")) {
                element.style.top = generateRandomLocations().locals.top;
                element.style.left = generateRandomLocations().locals.right;
              }

              const bombLeft = +element.style.left.replace("px", "");
              const bombTop = +element.style.top.replace("px", "");

              if (
                verifyColissions(
                  velocity.velocityX,
                  bombLeft,
                  velocity.velocityY,
                  bombTop,
                  30
                )
              ) {
                gameOver("A bomba caiu bem em cima de você!");
              }
            });
          } else {
            bomba.forEach((element) => {
              element.style.display = "none";
            });
          }
        }
        let intervalBomb = setInterval(initBomb, 3000);
        intervalos.push(intervalBomb);
      }

      let intervalDrones = setInterval(addNewMissels, 10000);
      intervalos.push(intervalDrones);

      setTimeout(moveAirAlien, 1000);

      function moveAirAlien() {
        alienY < velocity.velocityY ? alienY++ : (alienY = velocity.velocityY);
        alienX < velocity.velocityX ? alienX++ : (alienX = velocity.velocityX);
        airAlien[0].style.top = alienY + "px";
        airAlien[0].style.left = alienX + "px";

        if (
          verifyColissions(
            velocity.velocityX,
            alienX,
            velocity.velocityY,
            alienY,
            1
          )
        ) {
          setTimeout(() => {
            gameOver("A nave alien conseguiu te destruir!");
          }, 100);
        }
        let intervalNave = requestAnimationFrame(moveAirAlien);
        intervalos.push(intervalNave);
      }
    }

    function verifyIfColissionDrone() {
      gameOver("A nave colidiu com o drone e explodiu!");
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

    function gameOver(textOver) {
      const contentGameOver = document.querySelector(".gameOver");
      const elementSubtitle = document.querySelector(".motivo_over");
      const btnReset = document.querySelector(".resetGame");

      removeEvents();

      elementSubtitle.innerText = textOver;
      contentGameOver.classList.add("active");
      btnReset.addEventListener("click", () => {
        window.location.reload();
      });
    }
  }
}
