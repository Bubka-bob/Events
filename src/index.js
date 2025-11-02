import "./css/style.css";
import GameField from "./js/GameField.js";
import { closeModal } from "./js/message.js";

let gameInstance;

export function startNewGame() {
  if (gameInstance) {
    gameInstance.stopGame();
  }
  gameInstance = new GameField(4, 4, 1000);
  gameInstance.startGame();
}

document.getElementById("close-btn").addEventListener("click", closeModal);

window.onload = () => {
  startNewGame();
};
