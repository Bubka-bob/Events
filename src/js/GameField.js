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
    this.score = 0; // Текущий счёт
    this.missedHits = 0; // Пропущенных ударов
    this.isPlaying = false; // Флаг игры
    this.gnome = new Gnome("./img/gnome.png"); // Гном
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
    this.currentPosition = this.randomCell(); // Получаем случайную позицию
    this.gnome.renderTo(this.cells[this.currentPosition]); // Показываем гнома
    setTimeout(() => {
      this.hideCurrentGnome(); // Через секунду скрываем гнома
      this.spawnRandomGnome(); // Появляется новый гном
    }, 1000); // Задержка в миллисекундах
  }

  missHit() {
    this.missedHits++;
    this.updateMissesDisplay(); // Обновляем интерфейс с числом пропусков
    if (this.missedHits >= 5) {
      this.stopGame(); // Останавливаем игру, если достигли лимита пропусков
    }
  }

  gameOver() {
    let resultMessage = document.createElement('div');
    resultMessage.id = 'result-message';
    resultMessage.innerText = `
      🎉 Игра окончена!\n\n💥 Попали: ${this.score}\n❌ Пропустили: ${this.missedHits}`;
    resultMessage.style.position = 'absolute';
    resultMessage.style.top = '50%';
    resultMessage.style.left = '50%';
    resultMessage.style.transform = 'translate(-50%, -50%)';
    resultMessage.style.backgroundColor = '#ffffff';
    resultMessage.style.padding = '20px';
    resultMessage.style.borderRadius = '10px';
    resultMessage.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    resultMessage.style.fontSize = '1.5rem';
    resultMessage.style.color = '#333';
    resultMessage.style.zIndex = '1000';
    resultMessage.style.textAlign = 'center';

    document.body.append(resultMessage);

    // Удаляем результат через некоторое время
    setTimeout(() => {
      document.body.removeChild(resultMessage);
      startNewGame(); // Начинаем новую игру
    }, 3000); // Сообщение исчезает через 3 секунды
  }
  stopGame() {
    clearInterval(this.timer); // Очищаем таймер
    this.isPlaying = false; // Завершаем игру
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

