// Функция для показа модального окна
export function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modal.style.display = "block";
  modalMessage.innerText = message;
}

// Функция для закрытия модального окна
export function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}
