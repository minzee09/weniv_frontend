import { Intro, TabButtons } from "./components/index.js";
import removeAllChildNodes from "./utils/removeAllChildNodes.js";

export default class App {
  constructor(props) {
    this.props = props;
    this.currentMainIndex = 0;
  }

  // 비동기 초기화 메서드: 앱을 설정하는 작업을 수행
  async setup() {
    // props에서 el(루트 요소 선택자를) 추출
    const { el } = this.props;
    // 루트 요소를 DOM에서 선택해 저장
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
    const tabButtons = this.tabButtons.render(); // TabButtons를 렌더링하여 버튼들을 가져옴
    this.rootElement.append(tabButtons); // 루트 요소에 TabButtons를 추가하여 화면에 표시
  }
}
