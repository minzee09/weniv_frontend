export default class TopMusic {
  constructor() {
    this.rootElement = TopMusic.createRootElement();
    this.music = []; // 부모로부터 받은 음악 데이터 관리하는 객체
    this.bindEvents();
  }

  static createRootElement() {
    const rootElement = document.createElement("article");
    rootElement.classList.add("contents-top5");

    return rootElement;
  }

  bindEvents() {
    this.rootElement.addEventListener("click", (event) => {
      const { target } = event;
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

  // 모드 음악 재생 상태를 중단하는 UI 변경 처리
  renderStopAll() {
    const playingButtons = this.rootElement.querySelectorAll(".icon-pause");
    playingButtons.forEach((element) => element.classList.replace("icon-pause", "icon-play"));
  }

  // 음악재생을 App.js에 요청
  requestPlay(target) {
    const controller = target.parentElement;
    const { index: musicIndex } = controller.dataset;
    const payload = { music: this.music, musicIndex };
    this.emit("play", payload);
    this.renderStopAll();
    target.classList.replace("icon-play", "icon-pause");
  }

  // 음악 중단을 App.js에 요청
  requestPause(target) {
    this.emit("pause");
    target.classList.replace("icon-pause", "icon-play");
  }

  // 플레이 리스트에 추가 요청
  requestAddPlayList(target) {
    const controller = target.parentElement;
    const { index: musicIndex } = controller.dataset;
    const payload = { music: this.music, musicIndex };
    this.emit("addPlayList", payload);
  }

  //음악 데이터를 받아오기
  setMusic(music = []) {
    this.music = music;
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

  render() {
    const topRoof = `
        <div class="top5-roof">
            <img src="assets/images/logo.png">
        </div>
    `;

    const musicList = this.music
      .map((music, index) => {
        const { cover, title, artist } = music;
        return `
            <li>
                <div class="music-rank">${index + 1}</div>
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
    this.rootElement.innerHTML = topRoof + `<ol class="top5-list">` + musicList + `</ol>`;

    return this.rootElement;
  }
}
