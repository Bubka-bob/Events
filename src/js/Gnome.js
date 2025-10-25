export default class Gnome {
  constructor(imageSrc) {
    this.image = document.createElement("img");
    this.image.src = imageSrc;
    this.image.alt = "Gnome";
  }

  renderTo(parentNode) {
    parentNode.append(this.image);
  }

  removeFrom(parentNode) {
    parentNode.removeChild(this.image);
  }
}
