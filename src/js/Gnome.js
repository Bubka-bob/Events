export default class Gnome {
  constructor(imageSrc) {
    this.image = document.createElement("img");
    this.image.src = imageSrc;
    this.image.alt = "Gnome";
  }

  renderTo(cell) {
    cell.append(this.image);
  }

  removeFrom() {
    this.image.remove();
  }
}
