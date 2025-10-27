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
    this.createCells(); // Сначала создаем клетки

    // Затем добавляем обработчик кликов к каждой клетке
    this.cells.forEach((cell, idx) => {
      cell.addEventListener('click', () => {
        if (this.isPlaying && idx === this.currentPosition) {
          this.hitSuccess(); // Если кликнули правильно, увеличиваем счёт
        }
      });
    });
  }

  hitSuccess() {
    this.score++; // Увеличиваем счёт
    this.updateScoreDisplay(); // Обновляем интерфейс
    this.resetMissedHits(); // Сбрасываем пропущенные удары
    this.hideCurrentGnome(); // Скрываем текущего гнома
    this.spawnRandomGnome(); // Появляется новый гном
  }

  updateScoreDisplay() {
    this.scoreEl.textContent = this.score.toString(); // Обновляем значение на экране
  }

  updateMissesDisplay() {
    this.missesEl.textContent = this.missedHits.toString(); // Обновляем количество пропусков
  }

  resetMissedHits() {
    this.missedHits = 0; // Сбрасываем количество промахов
    this.updateMissesDisplay(); // Обновляем UI
  }

  hideCurrentGnome() {
    if (this.currentPosition !== null) {
      this.gnome.removeFrom(this.cells[this.currentPosition]); // Удаляем гнома из предыдущей клетки
    }
  }

spawnRandomGnome() {
    do {
      this.currentPosition = this.randomCell(); // Генерируем случайную позицию
    } while (this.previousPosition === this.currentPosition); // Пока не найдём новое положение

    this.previousPosition = this.currentPosition; // Сохраняем предыдущее положение
    this.gnome.renderTo(this.cells[this.currentPosition]); // Появляемся в новом положении
  
  setTimeout(() => {
      this.hideCurrentGnome(); // Через секунду прячемся
      this.spawnRandomGnome(); // Появляемся повторно
    }, 1000); // Задержка в миллисекундах
  }
  
  missHit() {
    this.missedHits++;
    this.updateMissesDisplay(); // Обновляем интерфейс с числом пропусков
    if (this.missedHits >= 5) {
      this.stopGame(); // Останавливаем игру, если достигли лимита пропусков
    }
  }

  stopGame() {
    clearInterval(this.timer); // Очищаем таймер
    this.isPlaying = false; // Завершаем игру
  }

  showNotification() {
    // Простое сообщение с результатами игры
    this.notificationEl.textContent = `Игра окончена! Вы набрали ${this.score} очков.`;
    this.notificationEl.classList.add('notification-visible');

    // Автоскрытие через 3 секунды
    setTimeout(() => {
      this.notificationEl.classList.remove('notification-visible');
    }, 3000);
  }
  
  
  startGame() {
    this.isPlaying = true; // Стартуем игру
    this.spawnRandomGnome(); // Появляется первый гном
    this.timer = setInterval(() => {
      this.missHit(); // Проверяем число пропусков
    }, this.intervalTime);
  }

  createCells() {
    for (let i = 0; i < this.cellCount; i++) {
      const cell = document.createElement('div');
      cell.classList.add('game-cell'); // Классифицируем каждую клетку
      this.cells.push(cell); // Добавляем её в массив
      this.container.append(cell); // Отображаем на странице
    }
  }

  randomCell() {
    return Math.floor(Math.random() * this.cellCount); // Случайная позиция гнома
  }
}

