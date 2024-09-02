import { Intro, TabButtons, TopMusic, SearchView, PlayList } from "./components/index.js";
import { fetchMusic } from "../APIs/index.js";
import removeAllChildNodes from "./utils/removeAllChildNodes.js";

export default class App {
  constructor(props) {
    this.props = props;
    this.currentMainIndex = 0;
    this.mainViewComponents = [];
  }

  // 비동기 초기화 메서드: 앱을 설정하는 작업을 수행
  async setup() {
    // props에서 el(루트 요소 선택자를) 추출
    const { el } = this.props;
    // 루트 요소를 DOM에서 선택해 저장
    this.rootElement = document.querySelector(el);
    this.intro = new Intro();
    this.tabButtons = new TabButtons();
    this.topMusic = new TopMusic();
    this.searchView = new SearchView();
    this.playList = new PlayList();
    this.mainViewComponents = [this.topMusic, this.playList, this.searchView];

    this.bindEvents();
    // 음악을 가져온다
    await this.fetchMusic();
    this.init();
  }

  bindEvents() {
    // 탭버튼 컴포넌트 이벤트
    this.tabButtons.on("clickTab", (payload) => {
      const { currentIndex = 0 } = payload;
      this.currentMainIndex = currentIndex;
      this.render();
    });

    //탑뮤직 컴포넌트 이벤트
    this.topMusic.on("play", (payload) => {
      // this.playView.playMusic(payload);
    });
    this.topMusic.on("pause", () => {
      // this.playView.pause();
    });
    this.topMusic.on("addPlayList", (payload) => {
      const { music, musicIndex } = payload;
      this.playList.add(music[musicIndex]);
    });

    // 플레이리스트에서 음악 요청이 오면 플레이뷰에게 음악 플레이 요청
    this.playList.on("play", (payload) => {
      // this.playView.playMusic(payload);
      // this.playView.show();
    });

    // 멈춤 요청이 오면 플레이뷰에게 멈춤 요청
    // this.playList.on("pause", () => { this.playView.pause(); });

    this.searchView.on("searchMusic", (query) => {
      if (!query) {
        return this.searchView.setSearchResult([]);
      }

      const searchedMusic = this.topMusic.music.filter((music) => {
        const { artist, title } = music;
        const upperCaseQuery = query.toUpperCase();
        // 아티스트 찾기
        const filteringName = artist.some((artist) =>
          artist.toUpperCase().includes(upperCaseQuery),
        );
        // 제목 찾기
        const filteringTitle = title.toUpperCase().includes(upperCaseQuery);

        return filteringName || filteringTitle;
      });

      // 찾은 결과를 검색뷰에 반환
      this.searchView.setSearchResult(searchedMusic);
    });

    this.searchView.on("play", (payload) => {
      // this.playView.playMusic(payload);
    });
    this.searchView.on("pause", () => {
      // this.playView.pause();
    });
    this.searchView.on("addPlayList", (payload) => {
      const { music, musicIndex } = payload;
      this.playList.add(music[musicIndex]);
    });
  }

  async fetchMusic() {
    const responseBody = await fetchMusic();
    const { music = [] } = responseBody;
    this.topMusic.setMusic(music);
  }

  init() {
    this.intro.show();
    setTimeout(() => {
      this.render();
      this.intro.hide();
    }, 1000);
  }

  renderMainView() {
    const renderComponent = this.mainViewComponents[this.currentMainIndex];
    return renderComponent ? renderComponent.render() : "";
  }

  render() {
    removeAllChildNodes(this.rootElement); // 초기화
    const tabButtons = this.tabButtons.render(); // TabButtons를 렌더링하여 버튼들을 가져옴
    const mainView = this.renderMainView();
    this.rootElement.append(tabButtons); // 루트 요소에 TabButtons를 추가하여 화면에 표시
    this.rootElement.append(mainView);
  }
}
