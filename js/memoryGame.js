export default function memoryGame() {
  if (document.body.classList.contains("mGame")) {
    const cards = document.querySelectorAll(".cards ul li");
    const correctHtml = document.querySelector(".setCorrect");
    const resetGame = document.querySelector(".resetMemory");

    resetGame.addEventListener("click", () => {
      window.location.reload();
    });

    let arr = [];
    let correct = 0;
    let setTime;

    function setMinuteAndSeconds() {
      const elementTime = document.querySelector(".time");
      let time = 0;
      setTime = setInterval(() => {
        time++;
        let mind = time % (60 * 60);
        let minutes = Math.floor(mind / 60);

        let secd = mind % 60;
        let seconds = Math.ceil(secd);

        seconds < 10 ? (seconds = `0${seconds}`) : seconds;

        const mAndS = `${minutes}:${seconds}`;
        elementTime.innerText = mAndS;
      }, 1000);
    }
    setMinuteAndSeconds();

    function clickCard({ target }) {
      if (
        target != arr[0] &&
        !target.parentElement.classList.contains("correctCard")
      ) {
        arr.push(target);
        target.parentElement.classList.add("click");
      }

      function desativeCards(condition) {
        if (arr.length === 2 && condition) {
          cards.forEach((element) => {
            element.style.pointerEvents = "none";
            element.style.userSelect = "none";
          });
        } else {
          cards.forEach((element) => {
            if (!element.classList.contains("correctCard")) {
              element.style.pointerEvents = "all";
              element.style.userSelect = "all";
            }
          });
        }
      }

      if (arr.length === 2 && arr[0].alt != arr[1].alt) {
        desativeCards(true);
        setTimeout(() => {
          arr.forEach((item) => item.parentElement.classList.remove("click"));
          desativeCards(false);
          arr.splice(0, 2);
        }, 700);
      } else if (arr.length === 2 && arr[0].alt === arr[1].alt) {
        desativeCards(true);
        arr.forEach((item) => {
          item.parentElement.classList.add("correctCard");
          item.parentElement.classList.remove("click");
        });
        setTimeout(() => {
          desativeCards(false);
        }, 500);
        arr.splice(0, 2);
        correct++;
      }

      if (correct === 8) clearInterval(setTime);
      correctHtml.innerText = correct;
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

      let arrImg1 = [];
      let arrImgs2 = arrImgs.map((item) => item);

      arrImgs = arrImgs.concat(...arrImgs2);

      for (let index = 0; index < arrImgs.length; index++) {
        const img = new Image();
        img.src = arrImgs[index];
        arrImg1.push(img.src);
      }
      return shuffleArray(arrImg1);
    }

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return setImgs(arr);
    }

    function setImgs(arr) {
      const random = arr;
      let diretorioImgs = [];
      random.forEach((element) => {
        const item = element.split("00/")[1];
        diretorioImgs.push(`../${item}`);
      });
      return diretorioImgs;
    }

    cards.forEach((element, i) => {
      element.addEventListener("click", (event) => {
        clickCard(event);
      });
    });

    randomImgs().forEach((element, i) => {
      const image = document.createElement("img");
      image.src = element;
      const nameIcon = element.split("/")[3].replace(".svg", "");
      image.alt = `${nameIcon}Icon`;
      cards[i].appendChild(image);
    });
  }
}
