export default class Intro {
  constructor() {
    this.parentElement = document.querySelector("body");
    this.renderElement = Intro.createRenderElement();
  }

  // 클래스 안에서만 사용 가능한 함수
  static createRenderElement() {
    const introContainer = document.createElement("div");
    introContainer.classList.add("intro");
    const introImage = document.createElement("img");
    introImage.src = "assets/images/logo.png";
    introImage.alt = "Intro Logo";

    introContainer.append(introImage);
    return introContainer;
  }

  show() {
    this.parentElement.append(this.renderElement);
  }

  hide() {
    this.renderElement.style.opacity = 0;
    setTimeout(() => {
      this.parentElement.removeChild(this.renderElement);
    }, 1000);
  }
}
