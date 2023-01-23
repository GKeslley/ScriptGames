import outsideClick from "../reused/outsideclick.js";

export default function geniusGame() {
  if (document.body.id === "geniusGame") {
    const content = document.querySelector(".genius");
    const colorContainer = document.querySelectorAll(".colorContainer");

    const countPlays = document.getElementById("count");
    const btnInitGame = document.querySelector(".genius .initBtn");

    const audios = document.querySelectorAll(".audios audio");

    if (content && colorContainer.length) {
      const openContentHelp = document.querySelector(".helpElement span");
      let contCorrect = 1;

      let sequence = 1;
      let count = 0;

      const randomNumbers = [];
      const targetColors = [];

      function openHelp() {
        const helpContent = document.querySelector(".help");
        const helpModal = document.querySelector(".helpModal");
        helpContent.classList.add("active");
        const outside = new outsideClick(helpModal, ["click"], () => {
          helpContent.classList.remove("active");
        });
        outside.init();
      }

      openContentHelp.addEventListener("click", openHelp);

      function startGeniusGame() {
        let i = contCorrect;

        function setRandomNumbers() {
          const randomColors = Math.floor(Math.random() * 4);
          return randomColors;
        }

        while (i + 1 > contCorrect) {
          randomNumbers.push(setRandomNumbers());
          i--;
        }

        function changingColors() {
          content.classList.add("proxRound");

          function setChangeColor() {
            const indexColorContainer = randomNumbers[count];

            colorContainer[indexColorContainer].classList.add("change");
            audios[indexColorContainer].play();

            setTimeout(() => {
              colorContainer[indexColorContainer].classList.remove("change");
            }, 200);

            setTimeout(() => {
              count++;
              if (count === randomNumbers.length) {
                clearInterval(changeColors);
                count = 0;
                content.classList.remove("proxRound");
              }
            }, 201);
          }

          const changeColors = setInterval(setChangeColor, 800);
        }

        changingColors();

        function choosingElement({ target }) {
          const eventTarget = [...colorContainer].indexOf(target);

          colorContainer.forEach((element) => element.classList.remove("current"));

          colorContainer[eventTarget].classList.add("current");
          targetColors.push([...colorContainer].indexOf(target));
          audios[eventTarget].play();
          verifyIsCorrect();
        }

        function verifyIsCorrect() {
          for (let targetTrue = 0; targetTrue < targetColors.length; targetTrue) {
            if (randomNumbers[targetTrue] === targetColors[targetTrue]) {
              targetTrue++;
            } else {
              targetTrue = 0;
              wrongSequence();
            }
          }

          const verifyEquality = targetColors.filter((element, i) => {
            return element === randomNumbers[i];
          });

          if (
            verifyEquality.length === randomNumbers.length &&
            verifyEquality.length > 0
          ) {
            sequence++;
            correctSequence();
          }
        }

        function clearAndRemoveEvent() {
          targetColors.splice(0, targetColors.length);
          colorContainer.forEach((element) => {
            element.removeEventListener("click", choosingElement);
          });
        }

        function correctSequence() {
          countPlays.innerText = sequence;
          contCorrect++;
          clearAndRemoveEvent();
          document.body.classList.add("correctSequence");
        }

        function wrongSequence() {
          randomNumbers.splice(0, randomNumbers.length);
          contCorrect = 1;
          sequence = 1;
          countPlays.innerText = 1;
          clearAndRemoveEvent();
          document.body.classList.add("wrongSequence");
        }

        function eventListenersClick() {
          colorContainer.forEach((element) => {
            element.addEventListener("click", choosingElement);
            element.addEventListener("mouseup", () => {
              setTimeout(() => {
                element.classList.remove("current");
              }, 200);
            });
          });
        }

        eventListenersClick();
      }

      function observerSequence() {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.target.classList.contains("correctSequence") ||
              mutation.target.classList.contains("wrongSequence")
            ) {
              document.body.classList.remove("correctSequence");
              document.body.classList.remove("wrongSequence");
              startGeniusGame();
            }
          });
        });

        observer.observe(document.body, { attributes: true });
      }

      observerSequence();

      function initGame() {
        btnInitGame.addEventListener("click", () => {
          btnInitGame.classList.add("userInitGame");
          startGeniusGame();
        });
      }

      initGame();
    }
  }
}
