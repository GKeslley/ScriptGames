export default function airGame() {
  if (document.body.id === "naveGame") {
    const content = document.querySelector(".screenGame");

    const modalInitGame = document.querySelector(".initGame");
    const btnInit = document.querySelector(".initGame button");

    const airPlayer = document.querySelector(".airPlayer");
    const imgAir = document.querySelector(".airPlayer img");

    let coinContent = document.querySelectorAll(".coin");
    const coinElement = document.querySelector(".quantMoedas");

    if (airPlayer && coinContent.length) {
      let localCoinsInScreen;
      let coins = 0;

      let drones = document.querySelectorAll(".drone");
      let listCoordsDrones = {};

      const screenWidth = content.clientWidth;
      const screenHeight = content.clientHeight;

      const intervalos = [];

      let x = 0;
      let y = 0;

      const arrGetRandomLocals = [];

      let alienY = 0;
      let alienX = 0;

      let moveAlienID;
      let intervalGunID;
      let animetionFrameID;

      let cancelFrame = false;

      btnInit.addEventListener("click", initGame);

      function initGame() {
        setEventsMove();
        modalInitGame.classList.add("close");
      }

      function generateRandomLocations() {
        const randomLocals = {
          left: `${Math.floor(Math.random() * (screenWidth - 100) + 100) - 34}px`,
          top: `${Math.floor(Math.random() * (screenHeight - 100) + 100) - 34}px`,
        };
        return {
          randomLocals,
        };
      }

      function getRandomLocals() {
        const setRandomCoins = setInterval(() => {
          const { randomLocals: coinsRandomLocals } = generateRandomLocations();
          arrGetRandomLocals.push(coinsRandomLocals);
          if (arrGetRandomLocals.length === 2) {
            clearInterval(setRandomCoins);
          }
        });
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

      function verifyColissions(velocityX, coordX, velocityY, coordY, col) {
        if (
          velocityX + col >= +coordX &&
          velocityX - col < +coordX &&
          velocityY + col >= +coordY &&
          velocityY < +coordY + col
        ) {
          return true;
        }
      }

      function setEventsMove() {
        window.addEventListener("keydown", moveAirInScreen);
        window.addEventListener("keyup", stopMoveAir);

        animetionFrameID = requestAnimationFrame(initFramesAndColissions);

        createEnemys();
      }

      function initFramesAndColissions() {
        enterFrame();

        localCoinsInScreen.forEach((coordsCoin) => {
          checkColissionCoin(coordsCoin);
        });

        checkColissionDrone();

        animetionFrameID = requestAnimationFrame(initFramesAndColissions);
        if (cancelFrame) removeEvents();
      }

      function moveWidth(desloc, veloc, scale) {
        displacement.deslocX = desloc;
        velocity.velocityX += veloc;
        displacement.scale = scale;
      }

      function moveHeight(desloc, veloc) {
        displacement.deslocY = desloc;
        velocity.velocityY += veloc;
      }

      function moveAirInScreen(event) {
        const key = event.key.toLocaleLowerCase();

        if (key === "d") {
          moveWidth(1.8, 3, -1);
          cordShots.right = false;
          cordShots.left = true;
        }
        if (key === "s") {
          moveHeight(1.8, 3);
        }
        if (key === "w") {
          moveHeight(-1.8, -3);
        }
        if (key === "a") {
          moveWidth(-1.8, -3, 1);
          cordShots.right = true;
          cordShots.left = false;
        }
      }

      function stopMoveAir(event) {
        const key = event.key.toLocaleLowerCase();

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
        const run = 2;

        velocity.velocityX += displacement.deslocX * run;
        velocity.velocityY += displacement.deslocY * run;

        airPlayer.style.transform = `translate3d(${velocity.velocityX}px, ${velocity.velocityY}px, 0px)`;
        imgAir.style.transform = `scaleX(${displacement.scale})`;

        if (velocity.velocityX > screenWidth - 34 || velocity.velocityX < 0) {
          velocity.velocityX = 0;
        }
        if (velocity.velocityY > screenHeight - 24 || velocity.velocityY < 0) {
          velocity.velocityY = 0;
        }
      }

      function applicationCordsInCoins() {
        localCoinsInScreen = arrGetRandomLocals;

        setTimeout(() => {
          localCoinsInScreen.forEach((cord, i) => {
            coinContent[i].style.left = cord.left;
            coinContent[i].style.top = cord.top;
          });
        }, 100);
      }

      applicationCordsInCoins();

      function checkColissionCoin(coordsCoin) {
        let { left: coordX, top: coordY } = coordsCoin;
        const { velocityX, velocityY } = velocity;

        coordX = coordX.replace("px", "");
        coordY = coordY.replace("px", "");

        if (verifyColissions(velocityX, coordX, velocityY, coordY, 24)) {
          coinContent.forEach((childCoin) => {
            if (childCoin.style.left === coordsCoin.left) {
              childCoin.style.display = "none";
              coins++;
              contCoins();
              if (coins === 30) winGame();
              if (content.contains(childCoin)) content.removeChild(childCoin);
            }
          });
        }

        coinContent = document.querySelectorAll(".coin");

        function addRandomCoins() {
          arrGetRandomLocals.splice(0, 2);
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

      function createEnemys() {
        const alienEnemy = document.querySelector(".alienEnemy");

        alienEnemy.style.top = generateRandomLocations().randomLocals.top;

        function createNewDronesAndBombs() {
          const createDrone = document.createElement("div");
          const imgDrone = document.createElement("img");

          createDrone.classList.add("drone");
          createDrone.appendChild(imgDrone);

          imgDrone.src = "../imgs/gameImgs/drone.png";
          content.appendChild(createDrone);

          drones = document.querySelectorAll(".drone");

          for (let index = 0; index < drones.length; index++) {
            const { top, left } = generateRandomLocations().randomLocals;

            const childDrone = drones[index];

            const topRandom = +top.replace("px", "") - 50;
            const leftRandom = +left.replace("px", "") - 50;

            childDrone.style.top = topRandom + "px";
            childDrone.style.left = leftRandom + "px";
          }

          function puttingBombsInScreen() {
            const { velocityX, velocityY } = velocity;

            drones = document.querySelectorAll(".drone");

            const bombs = document.querySelectorAll(".bomba");

            if (drones.length) {
              bombs.forEach((childBomb) => {
                childBomb.classList.add("on");
                childBomb.style.display = "block";

                if (childBomb.classList.contains("on")) {
                  childBomb.style.top = generateRandomLocations().randomLocals.top;
                  childBomb.style.left = generateRandomLocations().randomLocals.left;
                }

                const coordLeft = +childBomb.style.left.replace("px", "");
                const coordTop = +childBomb.style.top.replace("px", "");

                if (verifyColissions(velocityX, coordLeft, velocityY, coordTop, 26)) {
                  gameOver("A bomba caiu bem em cima de você!");
                }
              });
            } else {
              bombs.forEach((childBomb) => (childBomb.style.display = "none"));
            }
          }
          const intervalBomb = setInterval(puttingBombsInScreen, 4000);
          intervalos.push(intervalBomb);
        }

        const intervalDrones = setInterval(createNewDronesAndBombs, 10000);
        intervalos.push(intervalDrones);

        function moveAirAlien() {
          const { velocityX, velocityY } = velocity;

          alienY < velocity.velocityY ? alienY++ : (alienY = velocity.velocityY);
          alienX < velocity.velocityX ? alienX++ : (alienX = velocity.velocityX);
          alienEnemy.style.top = alienY + "px";
          alienEnemy.style.left = alienX + "px";

          if (verifyColissions(velocityX, alienX, velocityY, alienY, 1)) {
            setTimeout(() => {
              gameOver("A nave alien conseguiu te destruir!");
            }, 50);
            return;
          }

          moveAlienID = requestAnimationFrame(moveAirAlien);
        }
        setTimeout(() => {
          moveAlienID = requestAnimationFrame(moveAirAlien);
        }, 1000);
      }

      function checkColissionDrone() {
        const { velocityX, velocityY } = velocity;

        drones = document.querySelectorAll(".drone");

        const coordsDrones = [...drones].map((element) => {
          return [
            +element.style.top.replace("px", ""),
            +element.style.left.replace("px", ""),
          ];
        });

        listCoordsDrones = {
          drone: coordsDrones,
        };

        coordsDrones.forEach((coord) => {
          if (verifyColissions(velocityX, +coord[1], velocityY, +coord[0], 24)) {
            gameOver("A nave colidiu com o drone e explodiu!");
          }
        });
      }

      function shotsInScreen() {
        const localAirInScreen = `translate3d(${velocity.velocityX}px, ${velocity.velocityY}px, 0px)`;

        let airY = velocity.velocityY;
        let airX = velocity.velocityX;
        let leftShot = 0;

        const fireAir = document.querySelector(".fire");

        if (airPlayer.contains(fireAir)) {
          airPlayer.removeChild(fireAir);
        }

        const bullet = document.createElement("span");
        bullet.classList.add("fire");
        content.appendChild(bullet);

        bullet.style.transform = localAirInScreen;
        bullet.style.top = 12 + "px";
        bullet.style.left = 0 + "px";

        if (cordShots.right) bullet.classList.add("right");
        else if (cordShots.left) bullet.classList.add("left");

        function bulletFiring() {
          drones = document.querySelectorAll(".drone");

          if (bullet.classList.contains("right")) {
            bullet.style.left = `-${(leftShot += 3)}px`;
          } else if (bullet.classList.contains("left")) {
            bullet.style.transform = `translate3d(${(airX += 3)}px, ${airY}px, 0px)`;
          }

          if (airX > screenWidth - 50 || airX - leftShot < 5) {
            bullet.style.display = "none";
            if (content.contains(bullet)) content.removeChild(bullet);
          }

          if (drones.length) {
            removeDroneWithBullet(drones, airX, airY, leftShot);
          }

          intervalGunID = requestAnimationFrame(bulletFiring);
        }

        intervalGunID = requestAnimationFrame(bulletFiring);
      }

      function removeDroneWithBullet(drones, airX, airY, leftShot) {
        listCoordsDrones.drone.forEach((coord) => {
          const droneInArray = listCoordsDrones.drone.indexOf(coord);

          function deletDrone() {
            if (content.contains(drones[droneInArray])) {
              [...drones].splice(droneInArray, 1);
              listCoordsDrones.drone.splice(droneInArray, 1);
              content.removeChild(drones[droneInArray]);
            }
          }

          const colissionX = Math.abs(airX - leftShot);

          if (verifyColissions(colissionX, coord[1], airY, coord[0], 15)) {
            deletDrone();
          }
        });
      }

      function removeEvents() {
        cancelFrame = true;
        cancelAnimationFrame(animetionFrameID);
        cancelAnimationFrame(moveAlienID);
        cancelAnimationFrame(intervalGunID);

        for (let intervalosID of intervalos) {
          clearInterval(intervalosID);
        }

        window.removeEventListener("keydown", moveAirInScreen);
        window.removeEventListener("keyup", stopMoveAir);
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
          location.reload(true);
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
          location.reload(true);
        });
      }
    }
  }
}
