import shuffleArray from "../reused/shuffler.js";
import perguntasQuiz from "./perguntas.js";

export default function quizGame() {
  const btn = document.querySelector(".initQuiz");
  const contentQuiz = document.querySelector("#quizScreen");
  const contentQuestions = document.querySelector(".contentPerguntas div");
  let count = 1;

  function initGame() {
    contentQuiz.style.display = "none";
    document.body.classList.add("activeQuiz");
    selectQuestions();
  }

  function selectQuestions() {
    const questions = perguntasQuiz();

    const {
      questao1,
      questao2,
      questao3,
      questao4,
      questao5,
      questao6,
      questao7,
      questao8,
    } = questions.perguntas_respostas;

    const quantQuestions = Object.keys(questions.perguntas_respostas);
    const allQuestions = [];

    while (count <= quantQuestions.length) {
      allQuestions.push(`pergunta${count}`);
      count++;
    }

    let questionShuffle = shuffleArray(allQuestions);
    let firstQuestionShuffle = questionShuffle[0];

    function verifyQuestions() {
      contentQuestions.setAttribute("id", firstQuestionShuffle);
      questionShuffle.shift();

      firstQuestionShuffle = questionShuffle[0];

      switch (contentQuestions.id) {
        case "pergunta1":
          setQuestionsInHTML(questao1, "#pergunta1");
          break;
        case "pergunta2":
          setQuestionsInHTML(questao2, "#pergunta2");
          break;
        case "pergunta3":
          setQuestionsInHTML(questao3, "#pergunta3");
          break;
        case "pergunta4":
          setQuestionsInHTML(questao4, "#pergunta4");
          break;
        case "pergunta5":
          setQuestionsInHTML(questao5, "#pergunta5");
          break;
        case "pergunta6":
          setQuestionsInHTML(questao6, "#pergunta6");
          break;
        case "pergunta7":
          setQuestionsInHTML(questao7, "#pergunta7");
          break;
        case "pergunta8":
          setQuestionsInHTML(questao8, "#pergunta8");
          break;
        default:
          winQuiz();
          break;
      }
    }

    verifyQuestions();

    function setQuestionsInHTML(structureOfQuestion, elementID) {
      const questionID = document.querySelector(elementID);
      const { title1, img, opcoes } = structureOfQuestion;

      questionID.querySelector("h2").innerText = title1;
      questionID.querySelector("picture img").src = img;

      const options = opcoes;
      const options_li = questionID.querySelectorAll("ul li");

      const optionsValues = Object.values(options);
      const optionsKeys = Object.keys(options);

      function confirmAnswer({ target }) {
        let userChoice = optionsValues.indexOf(target.innerText);

        if (optionsKeys[userChoice] === "correta") {
          target.classList.add("markGreen");

          setTimeout(() => {
            target.classList.remove("markGreen");
            verifyQuestions();
          }, 1000);
        } else if (optionsKeys[userChoice] != "correta") {
          target.classList.add("markRed");
          buttonsResetGame();
        }

        removeEventClick();
      }

      options_li.forEach((element, i) => {
        element.innerText = optionsValues[i];
        element.addEventListener("click", confirmAnswer);
      });

      function removeEventClick() {
        options_li.forEach((element) => {
          element.removeEventListener("click", confirmAnswer);
        });
      }
    }

    function buttonsResetGame() {
      const reset = document.querySelector(".reset");
      const btns = document.querySelectorAll(".reset button");
      reset.classList.add("active");
      contentQuestions.classList.add("resetOpen");
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          location.reload(true);
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
