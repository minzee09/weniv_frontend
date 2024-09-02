import { findIndexListElement, getClosestElement } from "../../utils/index.js";

export default class TabButtons {
  constructor() {
    // renderElement는 탭 버튼들을 포함하는 HTML 요소임
    this.renderElement = TabButtons.createRenderElement();
    this.bindEvents();
  }

  // 정적 메서드: 탭 버튼을 생성하는 역할
  static createRenderElement() {
    // 탭 버튼들을 담을 ul 요소를 생성
    const tabsContainer = document.createElement("ul");
    tabsContainer.classList.add("app-controller");
    // 탭 목록 정의: 탭의 제목과 아이콘 이름을 설정
    const tabs = [
      { title: "Top5", iconName: "icon-top5" },
      { title: "PlayList", iconName: "icon-playlist" },
      { title: "Search", iconName: "icon-search" },
    ];

    // 탭 버튼들을 li 요소로 생성하고, tabsContainer에 넣음
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
      // 클릭된 요소에서 가장 가까운 li 태그를 찾음
      const element = getClosestElement(event.target, "li");
      // 해당 li 요소가 몇 번째인지 인덱스를 찾음
      const currentIndex = findIndexListElement(element);

      this.emit("clickTab", { currentIndex });
    });
  }
  // 통신을 받아 처리하는 함수
  // 다른 코드가 이 클래스에 이벤트와 콜백 함수를 등록할 수 있게 함
  on(eventName, callback) {
    // 이벤트 저장소 초기화
    this.events = this.events ? this.events : {};
    // 특정 이벤트에 대해 콜백 함수를 저장
    this.events[eventName] = callback;
  }

  // 통신을 보내는 함수
  // 특정 이벤트가 발생했음을 알리고, 필요한 데이터를 전달
  emit(eventName, payload) {
    // 해당 이벤트에 연결된 콜백 함수가 있으면 실행
    this.events[eventName] && this.events[eventName](payload);
  }

  // 렌더링 함수
  // 생성된 HTML 요소를 반환하여 화면에 표시할 수 있게 함
  render() {
    return this.renderElement;
  }
}
