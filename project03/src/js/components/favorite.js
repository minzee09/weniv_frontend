class Favorite{
    constructor(){
        this.favoriteElement = document.querySelector(".content-favorite");
    }

    setUp(){
        this.bindEvents();
    }

    bindEvents(){
        this.favoriteElement.addEventListener("click", (event) => {
            const cPath = event.composedPath(); //이벤트 경로를 배열로 변환 | 이벤트가 발생한 요소와 그 요소의 부모 요소들을 순서대로 나열
            const element = cPath.find(element => element.tagName === 'BUTTON')

            if (!element){
                return;
            }
            element.classList.toggle('on'); //`toggle` 메서드는 클래스가 존재하면 제거하고, 존재하지 않으면 추가
        });
    }
}

export default Favorite;