import "./css/style.css";

// import "./js/main";
import GameField from "./js/GameField.js";

let gameInstance;

function startNewGame() {
  if (gameInstance) {
    gameInstance.stopGame(); 
  }
  gameInstance = new GameField(4, 4, 1000); 
  gameInstance.startGame(); 
}


window.onload = () => {
startNewGame();
};