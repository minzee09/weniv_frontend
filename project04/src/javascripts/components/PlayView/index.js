export default class PlayView {
  constructor() {
    this.audio = new Audio();
    this.rootElement = PlayView.createRenderElement();
    // 현재 음악을 담당할 변수
    this.playViewMusic = null;
    // 반복 여부
    this.repeat = false;
    // 랜덤 재생 여부
    this.random = false;
    this.bindEvents();
  }

  static createRenderElement() {
    const playViewWrapper = document.createElement("article");
    playViewWrapper.classList.add("play-view");

    return playViewWrapper;
  }

  bindEvents() {
    this.audio.addEventListener("ended", () => {
      const fromPauseToPlay = this.rootElement.querySelector(".control-play");
      const fromPlayToPause = this.rootElement.querySelector(".control-pause");
      fromPlayToPause.classList.add("hide");
      fromPauseToPlay.classList.remove("hide");
      this.emit("musicEnded", { repeat: this.repeat, random: this.random });
    });

    let intervaler = 0;
    this.audio.addEventListener("timeupdate", () => {
      intervaler++;
      if (intervaler % 3 !== 0) {
        return;
      }

      const audioProgress = (this.audio.currentTime / this.audio.duration) * 100;
      const controlProgress = audioProgress > 100 ? 100 : audioProgress;
      const progressBarElement = this.rootElement.querySelector(".progress");
      progressBarElement.value = controlProgress ? controlProgress * 10 : 0;
    });
  }

  playMusic(payload) {
    this.pause();

    if (payload) {
      const { music, musicIndex } = payload;
      if (!music || !music[musicIndex]) {
        console.error("Invalid music data or index:", payload);
        return;
      }
      this.audio.src = music[musicIndex].source;
      this.playViewMusic = music[musicIndex];
      this.renderMusicContainer();
    }

    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  renderMusicContainer() {
    const { artist, cover, title } = this.playViewMusic;
    this.rootElement.innerHTML = `
      <div class="play-view-container">
        <h2 class="invisible-text">Play View</h2>
        <button class="back-button">
            <i class="icon-controller-back"></i>
        </button>
        <div class="cover-wrapper">
            <img src="http://localhost:3000${cover}" />
        </div>
        <div class="music-information">
            <h3 class="music-title">${title}</h3>
            <span class="music-artist-name">${artist.join(", ")}</span>
        </div>
        <div class="play-view-controller">
            <div class="controller-container">
                <button class="control-button control-random" ${this.random ? "on" : ""}>
                    <i class="icon-controller-random"></i>
                </button>
                <button class="control-button control-backward">
                    <i class="icon-controller-backward"></i>
                </button>
                <button class="control-button control-play hide">
                    <i class="icon-controller-play"></i>
                </button>
                <button class="control-button control-pause">
                    <i class="icon-controller-pause"></i>
                </button>
                <button class="control-button control-forward">
                    <i class="icon-controller-forward"></i>
                </button>
                <button class="control-button control-repeat ${this.repeat ? "on" : ""}">
                    <i class="icon-controller-repeat"></i>
                </button>
              </div>
              <div class="progress-container">
                  <input class="progress" type="range" min="0" max="1000" value="0">
                  <div class="progress-time">
                      <div class="current-time">1:43</div>
                      <div class="end-time">3:16</div>
                  </div>
              </div>
          </div>
      </div>
    `;

    const backButton = this.rootElement.querySelector(".back-button");
    const playButton = this.rootElement.querySelector(".control-play");
    const pauseButton = this.rootElement.querySelector(".control-pause");
    const forwardButton = this.rootElement.querySelector(".control-forward");
    const backwardButton = this.rootElement.querySelector(".control-backward");
    const repeat = this.rootElement.querySelector(".control-repeat");
    const random = this.rootElement.querySelector(".control-random");
    const progress = this.rootElement.querySelector(".progress");

    playButton.addEventListener("click", () => {
      this.playMusic();
      playButton.classList.add("hide");
      pauseButton.classList.remove("hide");
    });

    pauseButton.addEventListener("click", () => {
      this.pause();
      playButton.classList.remove("hide");
      pauseButton.classList.add("hide");
    });

    repeat.addEventListener("click", () => {
      this.repeat = !this.repeat;
      if (this.repeat) {
        repeat.classList.add("on");
      } else {
        repeat.classList.remove("on");
      }
    });

    random.addEventListener("click", () => {
      this.random = !this.random;
      if (this.random) {
        random.classList.add("on");
      } else {
        random.classList.remove("on");
      }
    });

    backButton.addEventListener("click", () => {
      this.hide();
    });

    backwardButton.addEventListener("click", () => {
      this.emit("backward");
    });

    forwardButton.addEventListener("click", () => {
      this.emit("forward");
    });

    progress.addEventListener("change", (event) => {
      const targetTime = (this.audio.duration * Number(event.target.value)) / 1000;
      this.audio.currentTime = targetTime;
    });
  }

  show() {
    document.body.append(this.rootElement);
  }

  hide() {
    document.body.removeChild(this.rootElement);
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
}
