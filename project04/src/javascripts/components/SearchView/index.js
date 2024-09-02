import { removeAllChildNodes } from "../../utils/index.js";

export default class SearchView {
  constructor() {
    this.rootElement = SearchView.createRootElement();
    this.searchedMusic = [];
    this.bindEvents();
  }

  static createRootElement() {
    const rootElement = document.createElement("article");
    rootElement.classList.add("contents-search");
    rootElement.innerHTML = `
         <div class="search-controller">
            <input class="search-input" type="text" placeholder="검색"/>
            <button class="search-button">
                <i class="icon-search-controller"></i>
            </button>
        </div>
        <ul class="music-list"></ul>
    `;

    return rootElement;
  }

  bindEvents() {
    this.rootElement.querySelector(".search-input").addEventListener("input", (event) => {
      const query = event.target.value;
      this.emit("searchMusic", query);
    });

    this.rootElement.addEventListener("click", (event) => {
      const { target } = event.target;
      const isControllerButton = target.tagName == "BUTTON";

      if (!isControllerButton) {
        return;
      }

      const buttonRole = target.classList.item(1); // 버튼 클래스의 두번째 클래스를 갖고 옴
      switch (buttonRole) {
        case "icon-play": {
          this.requestPlay(target);
          break;
        }
        case "icon-pause": {
          this.requestPause(target);
          break;
        }
        case "icon-plus": {
          this.requestAddPlayList(target);
          break;
        }
      }
    });
  }

  renderStopAll() {
    const playingButtons = this.rootElement.querySelectorAll(".icon-pause");
    playingButtons.forEach((element) => element.classList.replace("icon-pause", "icon-play"));
  }

  requestPlay(target) {
    const controller = target.parentElement;
    const { index: musicIndex } = controller.dataset;
    const payload = { music: this.music, musicIndex };
    this.enit("play", payload);
    this.renderStopAll();
    target.classList.replace("icon-play", "icon-pause");
  }

  requestPause(target) {
    this.enit("pause");
    target.classList.replace("icon-pause", "icon-play");
  }

  requestAddPlayList(target) {
    const controller = target.parentElement;
    const { index: musicIndex } = controller.dataset;
    const payload = { music: this.music, musicIndex };
    this.enit("addPlayList", payload);
  }

  setSearchResult(musicList = []) {
    this.searchedMusic = musicList;
    this.renderSearchedMusic();
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

  renderSearchedMusic() {
    const musicListElement = this.rootElement.querySelector(".music-list");
    removeAllChildNodes(musicListElement);
    const searchedMusic = this.searchedMusic
      .map((music, index) => {
        const { cover, title, artist } = music;
        return `
        <li>
            <div class="music-content">
                <div class="music-data">
                    <div class="music-cover">
                        <img src="${cover}" />
                    </div>
                    <div class="music-info">
                        <strong class="music-title">${title}</strong>
                        <em class="music-artist">${artist[0]}</em>
                    </div>
                </div>
                <div class="music-simple-controller" data-index=${index}>
                    <button class="icon icon-play">
                        <span class="invisible-text">재생</span>
                    </button>
                    <button class="icon icon-plus">
                        <span class="invisible-text">추가</span>
                    </button>
                </div>
            </div>
        </li>
      `;
      })
      .join("");

    musicListElement.innerHTML = searchedMusic;
  }

  render() {
    return this.rootElement;
  }
}
