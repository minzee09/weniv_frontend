import { Intro, TabButtons } from "./components/index.js";
import removeAllChildNodes from "./utils/removeAllChildNodes.js";

export default class App {
  constructor(props) {
    this.props = props;
    this.currentMainIndex = 0;
  }

  async setup() {
    const { el } = this.props;
    this.rootElement = document.querySelector(el);
    this.intro = new Intro();
    this.tabButtons = new TabButtons();

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.tabButtons.on("clicktab", (payload) => {
      const { currentIndex = 0 } = payload;
      this.currentMainIndex = currentIndex;
      this.render;
    });
  }

  init() {
    this.intro.show();
    setTimeout(() => {
      this.render();
      this.intro.hide();
    }, 1000);
  }

  render() {
    removeAllChildNodes(this.rootElement); // 초기화
    const tabButtons = this.tabButtons.render();
    this.rootElement.append(tabButtons);
  }
}
