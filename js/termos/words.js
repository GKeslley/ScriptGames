import shuffleArray from "../reused/shuffler.js";

export default function wordsTermos() {
  const languages = [
    "JAVA",
    "PYTHON",
    "DOCKER",
    "JAVASCRIPT",
    "REACT",
    "FLUTTER",
    "CSHARP",
    "ASSEMBLY",
    "KOTLIN",
    "PHP",
    "LARAVEL",
    "ELIXIR",
    "COBOL",
    "ANGULAR",
    "JQUERY",
    "SWIFT",
    "TYPESCRIPT",
  ];
  return shuffleArray(languages);
}
