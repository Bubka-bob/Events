import Gnome from "./Gnome.js";
import Image from "../img/gnome.png";
import { showModal } from "./message.js";

export default class GameField {
  constructor(rows, cols, intervalTime) {
    this.rows = rows;
    this.cols = cols;
    this.cellCount = rows * cols;
    this.intervalTime = intervalTime || 1000;
    this.container = document.getElementById("game-field");
    this.cells = [];
    this.scoreEl = document.getElementById("score");
    this.missesEl = document.getElementById("misses");
    this.score = 0;
    this.missedHits = 0;
    this.isPlaying = false;
    this.gnome = new Gnome(Image);
    this.currentPosition = null;
    this.previousPosition = null;
    this.setupEvents();
  }

  setupEvents() {
    this.createCells();
    this.cells.forEach((cell, idx) => {
      cell.addEventListener("click", () => {
        if (this.isPlaying && idx === this.currentPosition) {
          this.hitSuccess();
        }
      });
    });
  }

  spawnRandomGnome() {
    let nextPosition;
    do {
      nextPosition = this.randomCell();
    } while (nextPosition === this.previousPosition);
    this.previousPosition = this.currentPosition;
    this.currentPosition = nextPosition;
    this.gnome.renderTo(this.cells[this.currentPosition]);
  }

  hitSuccess() {
    this.score++;
    this.updateScoreDisplay();
    this.resetMissedHits();
    this.hideCurrentGnome();
    setTimeout(() => {
      this.spawnRandomGnome();
    }, 1000);
  }

  updateScoreDisplay() {
    this.scoreEl.textContent = this.score.toString();
  }

  updateMissesDisplay() {
    this.missesEl.textContent = this.missedHits.toString();
  }

  resetMissedHits() {
    this.missedHits = 0;
  }

  hideCurrentGnome() {
    if (this.currentPosition !== null) {
      this.gnome.removeFrom(this.cells[this.currentPosition]);
    }
  }

  missHit() {
    this.missedHits++;
    this.updateMissesDisplay();
    if (this.missedHits >= 5) {
      showModal("Игра закончена!");
      this.stopGame();
    }
  }

  stopGame() {
    clearInterval(this.timer);
    this.isPlaying = false;
  }

  startGame() {
    this.isPlaying = true;
    this.spawnRandomGnome();
    this.timer = setInterval(() => {
      this.hideCurrentGnome();
      this.spawnRandomGnome();
      this.missHit();
    }, this.intervalTime);
  }

  createCells() {
    for (let i = 0; i < this.cellCount; i++) {
      const cell = document.createElement("div");
      cell.classList.add("game-cell");
      this.cells.push(cell);
      this.container.append(cell);
    }
  }

  randomCell() {
    return Math.floor(Math.random() * this.cellCount);
  }
}
