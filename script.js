import airGame from "./js/naveGun.js";
import geniusGame from "./js/genius/genius.js";
import memoryGame from "./js/memoryGame.js";
import moveJoystick from "./js/mobile/joystick.js";
import quizGame from "./js/quiz/quizGame.js";
import termosGame from "./js/termos/termos.js";

memoryGame();
quizGame();
airGame();
geniusGame();
termosGame();
const joystick = new moveJoystick("#joystick", "#stick");
joystick.init();
