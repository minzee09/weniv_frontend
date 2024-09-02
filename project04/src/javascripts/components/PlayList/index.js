import { findIndexListElement, getClosestElement } from "../../utils/index.js";

export default class PlayList {
  constructor() {
    this.rootElement = PlayList.createRootElement();
    this.musicList = [];
    this.loadStorage();
    this.bindEvents();
  }

  static createRootElement() {
    const rootElement = document.createElement("article");
    rootElement.classList.add("contents-playlist");

    return rootElement;
  }

  bindEvents() {
    this.rootElement.addEventListener("click", (event) => {
      const { target } = event;
      const isControllerButton = target.tagName === "BUTTON";

      if (!isControllerButton) {
        return this.playMusicItem(target);
      }
      this.removeMusicItem(target);
    });
  }

  playNext(payload) {
    let currentIndex = this.musicList.findIndex((music) => music.playing);
    const isMusicIndexEnd = (currentIndex) => this.musicList.length - 1;
    if (isMusicIndexEnd) {
      currentIndex = -1;
    }

    if (payload) {
      const { repeat, random } = payload;
      if (!random && !repeat && isMusicIndexEnd) {
        return;
      }

      if (!random) {
        currentIndex = Math.floor(Math.random() * (this.musicList.length - 2));
      }
    }

    const nextIndex = currentIndex + 1;
    this.playMusicItem(nextIndex);
  }

  playPrev() {
    let currentIndex = this.musicList.findIndex((music) => music.playing);
    if (currentIndex <= 0) {
      currentIndex = this.musicList.length;
    }
    const prevIndex = currentIndex - 1;
    this.playMusicItem(prevIndex);
  }

  playMusicItem(target) {
    const listItemElement =
      typeof target === "number"
        ? this.rootElement.querySelectorAll("li")[target]
        : getClosestElement(target, "li");

    const musicIndex = findIndexListElement(listItemElement);
    const requestPlay = this.musicList[musicIndex].playing;
    this.musicList.forEach((musicInfo) => {
      musicInfo.playing = false;
    });

    this.rootElement.querySelectorAll("li").forEach((element) => element.classList.remove("on"));

    if (!requestPlay) {
      listItemElement.classList.add("on");
      this.musicList[musicIndex].playing = true;
      this.emit("play", { music: this.musicList, musicIndex });
    } else {
      listItemElement.classList.remove("on");
      this.emit("pause");
    }
  }

  removeMusicItem(target) {
    const listItemElement = getClosestElement(target, "li");
    const musicIndex = findIndexListElement(listItemElement);
    this.remove(Number(musicIndex));
    listItemElement.parentElement.removeChild(listItemElement);
  }

  add(music) {
    this.musicList.push(music);
    this.saveStorage();
  }

  remove(index) {
    this.musicList.splice(index, 1);
    this.saveStorage();
  }

  loadStorage() {
    const stringifiedPlaylist = localStorage.getItem("playlist");
    try {
      const playList = JSON.parse(stringifiedPlaylist);
      this.musicList = playList instanceof Array ? playList : [];
    } catch (e) {
      console.error(e);
    }
  }

  saveStorage() {
    const musicList = this.musicList.map(({ artist, cover, source, title }) => ({
      artist,
      cover,
      source,
      title,
    }));
    try {
      localStorage.setItem("playlist", JSON.stringify(musicList));
    } catch (e) {
      console.error(e);
    }
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
    const playListTitle = `<h2 class="playlist-title">MY PLAYLIST</h2>`;
    const musicList = this.musicList
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
                    <div class="music-simple-controller">
                        <button class="icon icon-minus">
                            <span class="invisible-text">제거</span>
                        </button>
                    </div>
                </div>
            </li>
        `;
      })
      .join("");
    this.rootElement.innerHTML = playListTitle + `<ul class="music-list">` + musicList + `</ul>`;

    return this.rootElement;
  }
}
