import Gnome from "./Gnome.js";
import Image from "../img/gnome.png";
import { startNewGame } from "../index.js";

export default class class GameField {
  constructor(rows, cols, intervalTime) {
    this.rows = rows;
    this.cols = cols;
    this.cellCount = rows * cols;
    this.intervalTime = intervalTime || 1000;
    this.container = document.getElementById('game-field');
    this.cells = [];
    this.scoreEl = document.getElementById('score');
    this.missesEl = document.getElementById('misses');
    this.notificationEl = document.getElementById('notification');
    this.score = 0;
    this.missedHits = 0;
    this.isPlaying = false;
    this.gnome = new Gnome(Image);
    this.currentPosition = null;
    this.setupEvents();
  }

  setupEvents() {
    this.createCells();

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

  updateMissesDisplay() {
    this.missesEl.textContent = this.missedHits.toString();
  }

  resetMissedHits() {
    this.missedHits = 0;
    this.updateMissesDisplay();
  }

  hideCurrentGnome() {
    if (this.currentPosition !== null) {
      this.gnome.removeFrom(this.cells[this.currentPosition]);
    }
  }

  spawnRandomGnome() {
    let nextPosition;
    do {
      nextPosition = this.randomCell();
    } while (nextPosition === this.currentPosition);

    this.currentPosition = nextPosition;
    this.gnome.renderTo(this.cells[nextPosition]);

    setTimeout(() => {
      this.hideCurrentGnome();
      this.missHit(); // Здесь вызываем пропуск удара, если никто не успел попасть
    }, this.intervalTime);
  }

  missHit() {
    this.missedHits++;
    this.updateMissesDisplay();

    if (this.missedHits >= 5) {
      this.stopGame();
    }
  }

  stopGame() {
    clearInterval(this.timer);
    this.isPlaying = false;
    this.showNotification();
  }

  showNotification() {
    this.notificationEl.textContent = `Игра окончена! Ваш итоговый результат: ${this.score} очков.`;
    this.notificationEl.classList.add('notification-visible');

    setTimeout(() => {
      this.notificationEl.classList.remove('notification-visible');
    }, 3000);
  }

  startGame() {
    this.isPlaying = true;
    this.spawnRandomGnome();
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
