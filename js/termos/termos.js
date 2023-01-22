import outsideClick from "../reused/outsideclick.js";
import wordsTermos from "./words.js";

export default function termosGame() {
  if (document.body.id === "termosBody") {
    const content = document.querySelector(".blocos");
    const words = document.querySelectorAll(".letras button");

    const resetContent = document.querySelector(".reset");
    const subTitleReset = resetContent.querySelector("span");

    const attempts = document.querySelector(".tentativa");
    const btnReset = document.querySelector(".btnReset");

    if (content && words.length) {
      const openContentHelp = document.querySelector(".helpElement span");

      const randomNumber = Math.floor(Math.random() * wordsTermos().length);
      const randomWord = wordsTermos()[randomNumber];

      const word = randomWord;

      let actualIndex = 0;
      let lengthWord = 0;

      const sizeWord = [];

      let userAttempt = 0;
      const arrWords = [];

      function createAndSetElements() {
        const setLis = document.createElement("ul");

        while (lengthWord < word.length) {
          const li = document.createElement("li");
          setLis.appendChild(li);
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

      function initGame({ target }) {
        const contentElements = document.querySelectorAll(".blocos ul");
        const targetText = target.innerText;

        const allElements = contentElements[userAttempt].querySelectorAll("li");

        let actualAttempt = arrWords[userAttempt];
        let allActualLetters;
        let allClassElements;

        function setWord() {
          if (targetText != "DEL" && targetText != "ENTER" && actualIndex < word.length) {
            for (let index = userAttempt; index < 5; index++) {
              const element = new Array();
              arrWords.push(element);
            }

            arrWords.length = 5;

            actualAttempt = arrWords[userAttempt];
            actualAttempt.push(...sizeWord);
            actualAttempt.length = word.length;

            allActualLetters = actualAttempt.filter((letter) => {
              return letter != undefined;
            });

            if (actualIndex < 0) actualIndex = allActualLetters.length;

            setTimeout(() => {
              if (actualAttempt.includes(undefined)) {
                allElements[actualIndex].innerText = targetText;
                actualIndex++;
              }
              setBorderInActualElement(actualIndex);
            }, 1);
          }
        }

        setWord();

        function setBorderInActualElement(actualIndexInElement) {
          function removeDataAttribute() {
            allElements.forEach((li) => li.removeAttribute("data-select"));
          }

          if (actualIndexInElement >= 0 && actualIndexInElement < word.length) {
            removeDataAttribute();
            allElements[actualIndexInElement].setAttribute("data-select", "true");
          }

          if (actualIndexInElement >= word.length || actualIndexInElement === -1) {
            removeDataAttribute();
          }
        }

        function deletWord() {
          if (targetText === "DEL" && actualAttempt.length) {
            actualIndex--;

            allActualLetters = actualAttempt.filter((letter) => {
              return letter != undefined;
            });

            const lastLetter = allActualLetters[allActualLetters.length - 1];
            const lastCaseLetter = actualAttempt.lastIndexOf(lastLetter);

            allElements[lastCaseLetter].innerText = "";
            allActualLetters.pop();

            actualAttempt.splice(lastCaseLetter, 1);
            actualIndex = actualAttempt.indexOf(undefined);

            setBorderInActualElement(actualIndex);
          }
        }

        deletWord();

        function confirmAttempt() {
          actualAttempt = arrWords[userAttempt];

          if (
            targetText === "ENTER" &&
            actualAttempt.length === word.length &&
            !actualAttempt.includes(undefined)
          ) {
            actualIndex = 0;
            userAttempt++;

            if (userAttempt >= 5) attempts.innerText = 5;
            else attempts.innerText = userAttempt + 1;
            allElements[0].parentElement.classList.add("complet");

            verifyWordAndChangeColor(actualAttempt);
          }
        }

        confirmAttempt();

        function resetGame() {
          resetContent.classList.add("active");

          words.forEach((letter) => letter.classList.add("desativeLetter"));

          btnReset.addEventListener("click", () => {
            window.location.reload(true);
          });
        }

        function verifyWordAndChangeColor(wordComplet) {
          wordComplet.forEach((letter, index) => {
            if (word.includes(letter)) {
              if (letter != word.split("")[index]) {
                allElements[index].classList.add("wrongPlaceLetter");
              } else {
                allElements[index].classList.add("correct");
              }
            } else {
              words.forEach((btnLetter) => {
                if (btnLetter.innerText === letter) {
                  btnLetter.classList.add("wrongLetter");
                }
              });
            }
          });
        }

        function loseGame() {
          subTitleReset.innerText = `A palavra correta era: ${word}`;
          setTimeout(resetGame, 500);
        }

        function checkIfHit() {
          function winGame() {
            const titleReset = resetContent.querySelector("p");

            attempts.innerText = userAttempt;
            titleReset.innerText = "Você acertou!";

            subTitleReset.innerText = `Palavra correta: ${word}`;
            setTimeout(resetGame, 500);
          }

          allClassElements = [...allElements].map((element) => {
            return element.getAttribute("class");
          });

          const correctLetters = allClassElements.filter(
            (element) => element === "correct"
          );

          if (correctLetters.length === word.length) {
            winGame();
          } else if (userAttempt === 5 && correctLetters.length < word.length) {
            loseGame();
          }
        }

        checkIfHit();

        function chooseElement({ target }) {
          allElements.forEach((element) => {
            element.classList.remove("modified");
          });

          target.classList.add("modified");

          if (target.classList.contains("modified")) {
            actualIndex = [...allElements].indexOf(target);
            setBorderInActualElement(actualIndex);
          }
        }

        function modifiedText() {
          if (actualAttempt != undefined) {
            allActualLetters = actualAttempt.filter((letter) => {
              return letter != undefined;
            });

            if (
              target.innerText != "ENTER" &&
              target.innerText != "DEL" &&
              (allActualLetters.length < word.length ||
                allClassElements.includes("modified"))
            ) {
              if (allActualLetters.length === word.length) {
                actualAttempt.splice(actualIndex, 1, target.innerText);
              } else {
                actualAttempt.splice(actualIndex - 1, 1, target.innerText);
                actualIndex = actualAttempt.indexOf(undefined);
                setBorderInActualElement(actualIndex);
              }
            }

            function changeLetter() {
              allElements.forEach((element) => {
                if (element.classList.contains("modified")) {
                  if (target.innerText != "DEL" && target.innerText != "ENTER") {
                    element.innerText = target.innerText;
                  }

                  actualIndex = actualAttempt.indexOf(undefined);
                  element.removeAttribute("data-select");
                }

                element.classList.remove("modified");
              });
            }

            changeLetter();
          }
        }

        setTimeout(modifiedText, 2);

        allElements.forEach((element) => {
          element.addEventListener("click", chooseElement);
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
        element.addEventListener("click", initGame);
      });
    }
  }
}
