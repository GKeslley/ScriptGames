import outsideClick from "../reused/outsideclick.js";
import wordsTermos from "./words.js";

export default function termosGame() {
  const content = document.querySelector(".blocos");
  const words = document.querySelectorAll(".letras button");
  const resetContent = document.querySelector(".reset");
  const attempts = document.querySelector(".tentativa");

  if (content && words.length) {
    const openContentHelp = document.querySelector(".helpElement span");

    const randomNumber = Math.floor(
      Math.random() * (wordsTermos().length - 0) + 0
    );

    const randomWord = wordsTermos()[randomNumber];

    let palavra = randomWord;

    let i = 0;
    let indexInArray = 0;
    let lengthWord = 0;
    const sizeWord = [];

    let blocoElement = 0;
    const arrWords = [];

    function createAndSetElements() {
      const setLis = document.createElement("ul");

      while (i < palavra.length) {
        const li = document.createElement("li");
        setLis.appendChild(li);
        i++;
      }

      while (lengthWord < palavra.length) {
        sizeWord.push(undefined);
        lengthWord++;
      }

      for (let index = 0; index < 5; index++) {
        const ul = document.createElement("ul");
        ul.innerHTML = `${setLis.innerHTML}`;
        ul.classList.add("blocos-item");
        content.appendChild(ul);
      }
    }
    createAndSetElements();

    function selectWord({ target }) {
      const contentElements = document.querySelectorAll(".blocos ul");
      const wordClick = target.innerText;
      const lis = contentElements[blocoElement].querySelectorAll("li");

      function setWord() {
        if (
          wordClick != "DEL" &&
          wordClick != "ENTER" &&
          indexInArray < palavra.length
        ) {
          for (let index = blocoElement; index < 5; index++) {
            const element = new Array();
            arrWords.push(element);
          }

          arrWords.length = 5;
          arrWords[blocoElement].push(...sizeWord);
          arrWords[blocoElement].length = palavra.length;

          const filtro = arrWords[blocoElement].filter((element) => {
            return element != undefined;
          });

          if (indexInArray < 0) indexInArray = filtro.length;

          setTimeout(() => {
            if (arrWords[blocoElement].includes(undefined)) {
              lis[indexInArray].innerText = wordClick;
              indexInArray++;
            }
            colorBlock(indexInArray);
          }, 1);
        }
      }
      setWord();

      function colorBlock(indexElement) {
        function removeDataAttribute() {
          lis.forEach((item) => item.removeAttribute("data-select"));
        }

        if (indexElement >= 0 && indexElement < palavra.length) {
          removeDataAttribute();
          lis[indexElement].setAttribute("data-select", "true");
        }

        if (indexElement < 0 && indexElement < palavra.length) {
          removeDataAttribute();
          lis[palavra.length + indexElement].setAttribute(
            "data-select",
            "true"
          );
        }

        if (indexElement >= palavra.length || indexElement === -1)
          removeDataAttribute();
      }

      function deletWord() {
        const arr = arrWords[blocoElement];

        if (wordClick === "DEL" && arr.length) {
          indexInArray--;

          const filterWords = arrWords[blocoElement].filter((element) => {
            return element != undefined;
          });

          const lastWord = filterWords[filterWords.length - 1];

          const lastElement = arrWords[blocoElement].lastIndexOf(lastWord);

          lis[lastElement].innerText = "";

          filterWords.pop();

          arrWords[blocoElement].splice(lastElement, 1);

          indexInArray = arrWords[blocoElement].indexOf(undefined);
          colorBlock(indexInArray);
        }
      }

      deletWord();

      function enterElement() {
        const arrWord = arrWords[blocoElement];
        if (
          wordClick === "ENTER" &&
          arrWord.length === palavra.length &&
          !arrWord.includes(undefined)
        ) {
          indexInArray = 0;
          blocoElement++;
          if (blocoElement >= 5) attempts.innerText = 5;
          else attempts.innerText = blocoElement + 1;
          checkIfWordIncludes(arrWord);
        }
      }

      enterElement();

      function resetGame() {
        const btnReset = document.querySelector(".btnReset");
        setTimeout(() => {
          resetContent.classList.add("active");
        }, 500);
        words.forEach((btn) => {
          btn.style.userSelect = "none";
          btn.style.pointerEvents = "none";
        });
        btnReset.addEventListener("click", () => {
          window.location.reload();
        });
      }

      function checkIfWordIncludes(wordComplet) {
        wordComplet.forEach((letter, index) => {
          if (palavra.includes(letter)) {
            if (letter != palavra.split("")[index]) {
              lis[index].style.background = "#ab9600";
            } else {
              lis[index].style.background = "green";
              lis[index].classList.add("correct");
            }
          } else {
            words.forEach((btn) => {
              if (btn.innerText === letter) {
                btn.style.background = "rgba(100, 100, 100, 5%)";
              }
            });
          }
        });

        function loseGame() {
          const subTitleReset = resetContent.querySelector("span");
          subTitleReset.innerText = `A palavra correta era: ${palavra}`;
          setTimeout(resetGame, 500);
        }

        function checkIfHit() {
          function winGame() {
            attempts.innerText = blocoElement;
            const titleReset = resetContent.querySelector("p");
            const subTitleReset = resetContent.querySelector("span");
            titleReset.innerText = "Você acertou!";
            subTitleReset.innerText = `Palavra correta: ${palavra}`;
            setTimeout(resetGame, 500);
          }

          const classElements = [...lis].map((element) => {
            return element.getAttribute("class");
          });

          lis[0].parentElement.classList.add("complet");

          const filtCorrects = classElements.filter(
            (element) => element === "correct"
          );

          if (filtCorrects.length === palavra.length) {
            winGame();
          } else if (
            blocoElement === 5 &&
            filtCorrects.length < palavra.length
          ) {
            loseGame();
          }
        }

        checkIfHit();
      }

      function modifiedBloco(event) {
        lis.forEach((element) => {
          element.classList.remove("modified");
        });
        event.target.classList.add("modified");

        if (event.target.classList.contains("modified")) {
          indexInArray = [...lis].indexOf(event.target);
          colorBlock(indexInArray);
          console.log("indexInArray do modified", indexInArray);
        }
      }

      function modifiedText() {
        if (arrWords[blocoElement] != undefined) {
          const filterWords = arrWords[blocoElement].filter((element) => {
            return element != undefined;
          });

          const classLis = [...lis].map((element) => {
            return element.getAttribute("class");
          });

          if (
            target.innerText != "ENTER" &&
            target.innerText != "DEL" &&
            (filterWords.length < palavra.length ||
              classLis.includes("modified"))
          ) {
            if (filterWords.length === palavra.length) {
              arrWords[blocoElement].splice(indexInArray, 1, target.innerText);
            } else {
              console.log("indexInArray subtrai", indexInArray);
              arrWords[blocoElement].splice(
                indexInArray - 1,
                1,
                target.innerText
              );
              indexInArray = arrWords[blocoElement].indexOf(undefined);
              colorBlock(indexInArray);
            }
          }

          lis.forEach((item) => {
            if (item.classList.contains("modified")) {
              if (target.innerText != "DEL" && target.innerText != "ENTER") {
                item.innerText = target.innerText;
              }
              indexInArray = arrWords[blocoElement].indexOf(undefined);
              console.log(arrWords[blocoElement].indexOf(false));
              console.log(indexInArray);
              item.removeAttribute("data-select");
            }

            item.classList.remove("modified");
          });
        }
      }

      setTimeout(() => {
        modifiedText();
      }, 2);

      lis.forEach((element) => {
        element.addEventListener("click", modifiedBloco);
      });
    }

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

    words.forEach((element) => {
      element.addEventListener("click", selectWord);
    });
  }
}
