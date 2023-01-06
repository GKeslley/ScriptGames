import perguntasQuiz from "./perguntas.js";

export default function quizGame() {
  const btn = document.querySelector(".initQuiz");
  const contentQuiz = document.querySelector("#quizScreen");
  const contentQuestions = document.querySelector(".contentPerguntas div");

  function initGame() {
    contentQuiz.style.display = "none";
    document.body.classList.add("activeQuiz");
    setInHtml();
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function setInHtml() {
    const perguntas = perguntasQuiz();
    const {
      questao1,
      questao2,
      questao3,
      questao4,
      questao5,
      questao6,
      questao7,
      questao8,
    } = perguntas.perguntas_respostas;
    let arrPerguntas = [
      "pergunta1",
      "pergunta2",
      "pergunta3",
      "pergunta4",
      "pergunta5",
      "pergunta6",
      "pergunta7",
      "pergunta8",
    ];

    let questionShuffle = shuffleArray(arrPerguntas);
    let firstQuestionShuffle = questionShuffle[0];

    function verifyQuestions() {
      contentQuestions.setAttribute("id", firstQuestionShuffle);
      questionShuffle.shift();
      firstQuestionShuffle = questionShuffle[0];
      switch (contentQuestions.id) {
        case "pergunta1":
          addTextInHTML(questao1, "#pergunta1");
          break;
        case "pergunta2":
          addTextInHTML(questao2, "#pergunta2");
          break;
        case "pergunta3":
          addTextInHTML(questao3, "#pergunta3");
          break;
        case "pergunta4":
          addTextInHTML(questao4, "#pergunta4");
          break;
        case "pergunta5":
          addTextInHTML(questao5, "#pergunta5");
          break;
        case "pergunta6":
          addTextInHTML(questao6, "#pergunta6");
          break;
        case "pergunta7":
          addTextInHTML(questao7, "#pergunta7");
          break;
        case "pergunta8":
          addTextInHTML(questao8, "#pergunta8");
          break;
        default:
          winQuiz();
          break;
      }
    }

    verifyQuestions();

    function addTextInHTML(perguntasObject, elementID) {
      let elementHtml = document.querySelector(elementID);
      elementHtml.querySelector("h2").innerText = perguntasObject.title1;
      elementHtml.querySelector("picture img").src = perguntasObject.img;
      const options_li = elementHtml.querySelectorAll("ul li");
      const options = perguntasObject.opcoes;
      const optionsValues = Object.values(options);
      const optionsKeys = Object.keys(options);

      function confirmAnswer({ target }) {
        let index = optionsValues.indexOf(target.innerText);
        if (optionsKeys[index] === "correta") {
          target.classList.add("markGreen");
          setTimeout(() => {
            target.classList.remove("markGreen");
            verifyQuestions();
          }, 1000);
        } else if (optionsKeys[index] != "correta") {
          target.classList.add("markRed");
          buttonsResetGame();
        }
        removeEventClick();
      }

      function removeEventClick() {
        options_li.forEach((element, i) => {
          element.removeEventListener("click", confirmAnswer);
        });
      }

      options_li.forEach((element, i) => {
        element.innerText = optionsValues[i];
        element.addEventListener("click", confirmAnswer);
      });
    }

    function buttonsResetGame() {
      const reset = document.querySelector(".reset");
      const btns = document.querySelectorAll(".reset button");
      reset.classList.add("active");
      contentQuestions.classList.add("resetOpen");
      btns.forEach((btn) => {
        btn.addEventListener("click", ({ target }) => {
          if (target.classList.contains("resetScreen")) {
            location.reload(true);
          }
        });
      });
    }

    function winQuiz() {
      const winContent = document.querySelector(".reset");
      winContent.querySelector("p").innerText = "Você venceu!";
      winContent.classList.add("active");
      buttonsResetGame();
    }
  }
  if (btn && contentQuiz) {
    btn.addEventListener("click", initGame);
  }
}
