export default function memoryGame() {
  if (document.body.classList.contains("mGame")) {
    const cards = document.querySelectorAll(".cards ul li");
    const correctHtml = document.querySelector(".setCorrect");
    const resetGame = document.querySelector(".resetMemory");

    resetGame.addEventListener("click", () => {
      window.location.reload();
    });

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
  }
}
