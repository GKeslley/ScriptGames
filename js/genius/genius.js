import outsideClick from "../outsideclick.js";

export default function geniusGame() {
  const content = document.querySelector(".genius");
  const elementBlock = document.querySelectorAll(".elementBlock");
  const countPlays = document.getElementById("count");
  const audios = document.querySelectorAll(".audios audio");
  const btnInitGame = document.querySelector(".genius .initBtn");

  if (content && elementBlock.length) {
    const openContentHelp = document.querySelector(".helpElement span");
    let contCorrect = 1;

    let sequence = 1;
    let indexZ = 0;
    let count = 0;

    const arrIndexs = [];
    const clickIndexs = [];

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

    function initGenius() {
      let i = contCorrect;

      function setRandomNumbers() {
        const randomColors = Math.floor(Math.random() * 4);
        return randomColors;
      }

      while (i + 1 > contCorrect) {
        arrIndexs.push(setRandomNumbers());
        i--;
      }

      function coloring() {
        content.classList.add("exp");

        function setChangeColor() {
          console.log(arrIndexs);

          //Adiciona a classe change
          elementBlock[arrIndexs[count]].classList.add("change");
          audios[arrIndexs[count]].play();

          //Em 500 milisegundos ele remove a classe
          setTimeout(() => {
            elementBlock[arrIndexs[count]].classList.remove("change");
          }, 200);

          //Para não ativar duas vezes a função, logo apos a remoção ele soma +1 e da clear
          //no intervalo se for igual aos length dos indexs
          setTimeout(() => {
            count++;
            if (count === arrIndexs.length) {
              clearInterval(changeColors);
              count = 0;
              content.classList.remove("exp");
            }
          }, 201);
        }

        const changeColors = setInterval(setChangeColor, 1000);
      }

      coloring();

      function clickBlock({ target }) {
        const eventTarget = [...elementBlock].indexOf(target);
        elementBlock.forEach((element) => element.classList.remove("current"));
        elementBlock[eventTarget].classList.add("current");
        clickIndexs.push(...[[...elementBlock].indexOf(target)]);
        audios[eventTarget].play();
        verifyIsCorrect();
      }

      function verifyIsCorrect() {
        for (indexZ = 0; indexZ < clickIndexs.length; indexZ) {
          if (arrIndexs[indexZ] === clickIndexs[indexZ]) {
            indexZ++;
          } else {
            console.log("errou");
            indexZ = 0;
            lose();
          }
        }

        const verifyEquality = clickIndexs.filter((element, i) => {
          return element === arrIndexs[i];
        });

        console.log(verifyEquality);
        console.log(arrIndexs);

        if (
          verifyEquality.length === arrIndexs.length &&
          verifyEquality.length > 0
        ) {
          sequence++;
          correct();
        }
      }

      function clearAndRemoveEvent() {
        clickIndexs.splice(0, clickIndexs.length);
        elementBlock.forEach((element, i) => {
          element.removeEventListener("click", clickBlock);
        });
      }

      function correct() {
        console.log(sequence);
        countPlays.innerText = sequence;
        console.log("correto");
        contCorrect++;
        clearAndRemoveEvent();
        document.body.classList.add("correctSequence");
      }

      function lose() {
        arrIndexs.splice(0, arrIndexs.length);
        contCorrect = 1;
        sequence = 1;
        countPlays.innerText = 1;
        clearAndRemoveEvent();
        document.body.classList.add("wrongSequence");
      }

      elementBlock.forEach((element, i) => {
        element.addEventListener("click", clickBlock);
        element.addEventListener("mouseup", () => {
          setTimeout(() => {
            element.classList.remove("current");
          }, 200);
        });
      });
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.target.classList.contains("correctSequence") ||
          mutation.target.classList.contains("wrongSequence")
        ) {
          document.body.classList.remove("correctSequence");
          document.body.classList.remove("wrongSequence");
          initGenius();
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    function initGame() {
      btnInitGame.addEventListener("click", () => {
        btnInitGame.classList.add("userInitGame");
        initGenius();
      });
    }

    initGame();
  }
}
