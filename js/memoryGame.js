import shuffleArray from "./reused/shuffler.js";

export default function memoryGame() {
  if (document.body.classList.contains("mGame")) {
    const cards = document.querySelectorAll(".cards ul li");
    const hitCount = document.querySelector(".hitCount");
    const resetGame = document.querySelector(".resetMemory");

    let targetCards = [];
    let correct = 0;
    let setTime;

    function setMinuteAndSeconds() {
      const elementTime = document.querySelector(".time");
      let time = 0;

      setTime = setInterval(() => {
        time++;

        let mind = time % (60 * 60);
        let minutes = Math.floor(mind / 60);

        let seconds = Math.ceil(mind % 60);

        seconds < 10 ? (seconds = `0${seconds}`) : seconds;

        const mAndS = `${minutes}:${seconds}`;
        elementTime.innerText = mAndS;
      }, 1000);
    }

    setMinuteAndSeconds();

    function clickCard({ target }) {
      if (
        target != targetCards[0] &&
        !target.parentElement.classList.contains("correctCard")
      ) {
        targetCards.push(target);
        target.parentElement.classList.add("showCard");
      }

      function desativeCards(condition) {
        cards.forEach((element) => {
          if (condition) element.classList.add("desativeCard");
          else if (!condition && !element.classList.contains("correctCard")) {
            element.classList.remove("desativeCard");
            element.classList.remove("showCard");
          }
        });
      }

      function differentCards() {
        desativeCards(true);

        setTimeout(() => {
          targetCards.splice(0, 2);
          desativeCards(false);
        }, 500);
      }

      function equalCards() {
        desativeCards(true);

        targetCards.forEach((card) => {
          card.parentElement.classList.add("correctCard");
        });

        correct++;

        setTimeout(() => {
          targetCards.splice(0, 2);
          desativeCards(false);
        }, 500);
      }

      const [card1, card2] = targetCards;

      if (targetCards.length === 2) {
        if (card1.alt != card2.alt) differentCards();
        else equalCards();
      }

      if (correct === 8) clearInterval(setTime);
      hitCount.innerText = correct;
      randomImgs();
    }

    function randomImgs() {
      let arrImgs = [
        "../imgs/memoryGameIcons/cM.svg",
        "../imgs/memoryGameIcons/docker.svg",
        "../imgs/memoryGameIcons/graphql.svg",
        "../imgs/memoryGameIcons/java.svg",
        "../imgs/memoryGameIcons/javascript.svg",
        "../imgs/memoryGameIcons/node.svg",
        "../imgs/memoryGameIcons/python.svg",
        "../imgs/memoryGameIcons/react.svg",
      ];

      const cloneImgs = arrImgs.map((item) => item);
      arrImgs = arrImgs.concat(...cloneImgs);
      return shuffleArray(arrImgs);
    }

    randomImgs().forEach((img, i) => {
      const icons = document.querySelectorAll(".cards ul li img");
      const nameIcon = img.split("/")[3].replace(".svg", "");
      icons[i].src = img;
      icons[i].alt = `${nameIcon}Icon`;
    });

    resetGame.addEventListener("click", () => {
      window.location.reload();
    });

    cards.forEach((element) => {
      element.addEventListener("click", clickCard);
    });
  }
}
