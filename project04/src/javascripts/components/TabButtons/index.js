import { findIndexListElement, getClosestElement } from "../../utils/index.js";

export default class TabButtons {
  constructor() {
    this.renderElement = TabButtons.createRenderElement();
    this.bindEvents();
  }

  static createRenderElement() {
    const tabsContainer = document.createElement("ul");
    tabsContainer.classList.add("app-controller");
    const tabs = [
      { title: "Top5", iconName: "icon-top5" },
      { title: "PlayList", iconName: "icon-playlist" },
      { title: "Search", iconName: "icon-search" },
    ];

    tabsContainer.innerHTML = tabs
      .map((tab) => {
        return `
            <li>
                <button type="button" class="button-app-controller">
                    <i class="tab-icon ${tab.iconName}"></i>
                    ${tab.title}
                </button>
            </li>
        `;
      })
      .join(""); // 반환된 배열 요소를 연결해서 하나의 문자열로 반환

    return tabsContainer;
  }

  bindEvents() {
    this.renderElement.addEventListener("click", (event) => {
      const element = getClosestElement(event.target, "li"); // 가장 가까운 li를 찾음
      const currentIndex = findIndexListElement(element);

      this.emit("clickTab", { currentIndex });
    });
  }
  // 통신을 건네주는 함수
  // app.js은 on함수를 총해 TabButtons 컴포넌트에 뭔가를 요청할 수 있게 함
  on(eventName, callback) {
    this.events = this.events ? this.events : {};
    this.events[eventName] = callback;
  }

  // 통신을 받는 함수
  // app.js와 통신할 수 있게 만들어주는 함수
  emit(eventName, payload) {
    this.events[eventName] && this.events[eventName](payload);
  }

  render() {
    return this.renderElement;
  }
}
