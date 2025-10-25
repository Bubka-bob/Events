import Gnome from "./Gnome.js";
import Image from "../img/gnome.png";

export default class GameField {
  constructor(rows, cols, intervalTime) {
    this.rows = rows;
    this.cols = cols;
    this.cellCount = rows * cols;
    this.intervalTime = intervalTime || 1000;
    this.container = document.getElementById('game-field');
    this.cells = [];
    this.scoreEl = document.getElementById('score');
    this.score = 0;
    this.missedHits = 0;
    this.isPlaying = false;
    this.gnome = new Gnome(Image); 
    this.currentPosition = null;
    this.setupEvents();
  }

  setupEvents() {
      this.cells.forEach((cell, idx) => {
      cell.addEventListener('click', () => {
        if (this.isPlaying && idx === this.currentPosition) {
          this.hitSuccess();
        }
      });
    });
  }

  hitSuccess() {
    this.score++; 
    this.updateScoreDisplay(); 
    this.resetMissedHits(); 
    this.hideCurrentGnome(); 
    this.spawnRandomGnome(); 
  }

  updateScoreDisplay() {
    this.scoreEl.textContent = this.score.toString();
  }

  resetMissedHits() {
    this.missedHits = 0;
  }

  hideCurrentGnome() {
    if (this.currentPosition !== null) {
      this.gnome.removeFrom(this.cells[this.currentPosition]); 
    }
  }

  spawnRandomGnome() {
    this.currentPosition = this.randomCell(); 
    this.gnome.renderTo(this.cells[this.currentPosition]); 
  }

  missHit() {
    this.missedHits++;
    if (this.missedHits >= 5) {
      alert('Game Over!');
      this.stopGame();
    }
  }

  stopGame() {
    clearInterval(this.timer);
    this.isPlaying = false;
  }

  startGame() {
    this.isPlaying = true;
    this.createCells();
    this.spawnRandomGnome();
    this.timer = setInterval(() => {
      this.hideCurrentGnome();
      this.spawnRandomGnome();
      this.missHit();
    }, this.intervalTime);
  }

  createCells() {
    for (let i = 0; i < this.cellCount; i++) {
      const cell = document.createElement('div');
      cell.classList.add('game-cell');
      this.cells.push(cell);
      this.container.append(cell);
    }
  }

  randomCell() {
    return Math.floor(Math.random() * this.cellCount);
  }
}


