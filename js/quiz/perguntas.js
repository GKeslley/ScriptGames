export default function perguntas() {
  const perguntasQuiz = {
    perguntas_respostas: {
      questao1: {
        title1: "Em que ano surgiu a linguagem JavaScript?",
        img: "../imgs/memoryGameIcons/javascript.svg",
        opcoes: {
          op1: "1992",
          correta: "1995",
          op3: "2000",
          op4: "1999",
        },
      },
      questao2: {
        title1: "Quem inventou a linguagem javascript",
        img: "../imgs/quizImgs/creatorScript.png",
        opcoes: {
          op1: "Guido Van Rossum",
          op2: "Jake Live",
          op3: "James Gosling",
          correta: "Brendan Eich",
        },
      },
      questao3: {
        title1: "Qual a linguagem a seguir",
        img: "../imgs/memoryGameIcons/java.svg",
        opcoes: {
          op1: "Flutter",
          op2: "C++",
          correta: "Java",
          op4: "React",
        },
      },
      questao4: {
        title1: "Qual o retorno da função a seguir",
        img: "../imgs/quizImgs/codeQuiz.png",
        opcoes: {
          op1: "[1, null, 2]",
          op2: "[1, 2, '', 5]",
          correta: "[1, 2, 5]",
          op4: "[1, 2, 0, 5]",
        },
      },
      questao5: {
        title1: "Como arredondar o número 7.25, para o inteiro mais próximo?",
        img: "../imgs/quizImgs/number.svg",
        opcoes: {
          op1: "Math.rnd(7.25)",
          correta: "Math.round(7.25)",
          op2: "rnd(7.25)",
          op4: "Math.abs(7.25)",
        },
      },
      questao6: {
        title1: "Qual o retorno da função",
        img: "../imgs/quizImgs/codeQuiz3.png",
        opcoes: {
          correta: "1",
          op2: "'1'",
          op3: "21",
          op4: "'21'",
        },
      },
      questao7: {
        title1: "A primeira linguagem de programação comercializada",
        img: "../imgs/quizImgs/linguagem.png",
        opcoes: {
          op1: "Assembly",
          op2: "COBOL",
          op3: "Plankalkül",
          correta: "FORTRAN",
        },
      },
      questao8: {
        title1: "Qual o resultado da variavel",
        img: "../imgs/quizImgs/variavel.png",
        opcoes: {
          op1: "32",
          correta: "27",
          op3: "-27",
          op4: "30",
        },
      },
    },
  };
  return perguntasQuiz;
}
