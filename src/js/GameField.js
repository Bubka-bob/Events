import Gnome from "./Gnome.js";
import Image from "../img/gnome.png";
import { startNewGame } from "../index.js";

export default class GameField {
  constructor(rows, cols, intervalTime) {
    this.rows = rows; // Количество строк
    this.cols = cols; // Количество столбцов
    this.cellCount = rows * cols; // Общее количество клеток
    this.intervalTime = intervalTime || 1000; // Интервал появления гнома
    this.container = document.getElementById('game-field'); // Контейнер игрового поля
    this.cells = []; // Массив всех игровых клеток
    this.scoreEl = document.getElementById('score'); // Элемент счёта игрока
    this.missesEl = document.getElementById('misses'); // Элемент числа пропусков
    this.notificationEl = document.getElementById('notification');
    this.score = 0; // Текущий счёт
    this.missedHits = 0; // Пропущенных ударов
    this.isPlaying = false; // Флаг игры
    this.gnome = new Gnome(Image); // Гном
    this.currentPosition = null; // Текущая позиция гнома
    this.setupEvents(); // Установка событий
  }

  setupEvents() {
    this.createCells(); // Создаем клетки перед добавлением событий

    // Добавляем обработчики кликов к каждой клетке
    this.cells.forEach((cell, idx) => {
      cell.addEventListener('click', () => {
        if (this.isPlaying && idx === this.currentPosition) {
          this.hitSuccess(); // Увеличение счета при удачном попадании
        }
      });
    });
  }

  hitSuccess() {
    this.score++; // Увеличиваем счёт
    this.updateScoreDisplay(); // Обновляем интерфейс
    this.resetMissedHits(); // Сбрасываем пропущенные удары
    this.hideCurrentGnome(); // Прячем текущего гнома
    this.spawnRandomGnome(); // Показываем нового гнома
  }

  updateScoreDisplay() {
    this.scoreEl.textContent = this.score.toString(); // Обновляем отображаемый счёт
  }

  updateMissesDisplay() {
    this.missesEl.textContent = this.missedHits.toString(); // Обновляем отображаемое количество пропусков
  }

  resetMissedHits() {
    this.missedHits = 0; // Сбрасываем количество пропусков
    this.updateMissesDisplay(); // Обновляем интерфейс
  }

  hideCurrentGnome() {
    if (this.currentPosition !== null) {
      this.gnome.removeFrom(this.cells[this.currentPosition]);
    }
  }

  spawnRandomGnome() {
    if (!this.isPlaying) return;
    let nextPosition;
    do {
      nextPosition = this.randomCell(); // Генерация новой случайной позиции
    } while (nextPosition === this.currentPosition); // Исключаем повторную позицию

    this.currentPosition = nextPosition; // Устанавливаем новую позицию
    this.gnome.renderTo(this.cells[nextPosition]); // Отображение гнома в новой позиции

   setTimeout(() => {
      this.hideCurrentGnome();
      
      // Проверяем статус игры ДО запуска процедуры пропуска
      if (this.isPlaying) {
        this.missHit(); // Только если игра активна, считаем промах
      }
    }, this.intervalTime);
  }

  missHit() {
    this.missedHits++; // Инкрементируем количество пропусков
    this.updateMissesDisplay(); // Обновляем интерфейс

    if (this.missedHits >= 5) {
      this.stopGame(); // Останавливаем игру при достижении 5 пропусков
    }
  }

  gameOver() {
    this.stopGame(); // Остановка игры
    this.showNotification(); // Показ результата
  }

  stopGame() {
    clearInterval(this.timer); // Очистка интервала
    this.isPlaying = false; // Смена статуса игры
  }

  showNotification() {
    this.notificationEl.textContent = `Игра окончена! Ваш итоговый результат: ${this.score} очков.`;
    this.notificationEl.classList.add('notification-visible');

    setTimeout(() => {
      this.notificationEl.classList.remove('notification-visible');
    }, 3000);
  }

  startGame() {
    this.isPlaying = true; // Запуск игры
    this.spawnRandomGnome(); // Первый показ гнома
    this.timer = setInterval(() => {}, this.intervalTime); // Таймер для удобства, хотя здесь он фактически пустой
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
    return Math.floor(Math.random() * this.cellCount); // Получаем случайную позицию гнома
  }
}

