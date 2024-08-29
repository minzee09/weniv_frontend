// 호버 상태에 따른 이미지 맵핑 객체
const starImageSourceProp = {
    empty: "./src/images/아이콘_별_3.png",
    half: "./src/images/아이콘_별_2.png",
    full: "./src/images/아이콘_별_1.png",
}

class StarPoint {
    constructor() {
        this.starContentElement = document.querySelector('.content-star');
        this.starBackgroundElement = document.querySelector('.star-background');
        this.starImages=this.starBackgroundElement.querySelectorAll('img');
        this.starPointResetButton=this.starContentElement.querySelector('.icon-remove-star');
        this.lockedStarPoint = false // 별점이 고정되어 있는지
    }

    setUp(){
        this.bindEvents()
    }

    lockStarPoint(){
        this.lockedStarPoint = true;
    }

    unlockStarPoint(){
        this.lockedStarPoint = false;
    }

    isLockedStarPoint() {
        return this.lockedStarPoint;
    }

    bindEvents(){
        // 마우스 무브 이벤트
        this.starBackgroundElement.addEventListener('mousemove', (event) => {
            
            // 별점이 고정되어 있다면 이벤트 핸들링 금지
            if(this.isLockedStarPoint()){
                return;
            }

            const {target, offsetX : currentUserPoint} = event; // offsetX : 타겟 요소에서의 마우스 포인터의 x축
            const {point} = target.dataset;
            const starPointIndex = parseInt(point, 10) - 1;
            const starImageClientRect = target.getClientRects()[0]; // 요소의 크기와 좌표에 대한 정보 반환
            const starImageWidth = starImageClientRect.width;
            const isOverHalf = starImageWidth / 2 < currentUserPoint; // 마우스 포인터의 위치가 별점 중간을 넘어서면 true 아니면 false
        
            this.renderStarPointImages({drawableLimitIndex: starPointIndex, isOverHalf});
        })
        // 마우스 클릭시 별점 고정
        this.starBackgroundElement.addEventListener('click', () => this.lockStarPoint());
        // 리셋버튼 핸들러 전달
        this.starPointResetButton.addEventListener('click', () => {
            this.unlockStarPoint()
            this.resetStarPointImages();
        })
        // 마우스 아웃 당시 별점이 고정 상태 아니라면 별점 초기화
        this.starBackgroundElement.addEventListener('mouseout', () => {
            if(!this.isLockedStarPoint())    
                this.resetStarPointImages()
        })
    }

    renderStarPointImages(payload = {}){
        const {drawableLimitIndex = -1, isOverHalf = false} = payload // 초기값 할당
        //NodeList !== Array / call을 통해서 함수를 호출하는 객체를 Array에서 NodeList 객체로 재할당
        Array.prototype.forEach.call(this.starImages,(starImage, index) => {
            
            // 현재 순환 순서보다 마우스가 호버된 별이 인덱스가 크다면 꽉찬 별이고 아니면 빈별을 채움
            let imageSource = index < drawableLimitIndex ? starImageSourceProp.full : starImageSourceProp.empty;
            
            // 현재 순환 순서와 마우스가 호버된 범위 인덱스가 같은 경우
            if (drawableLimitIndex === index){
                imageSource = isOverHalf ? starImageSourceProp.full : starImageSourceProp.half;
            }
            // 현재 순환중인 이미지에 src 값을 할당
            starImage.src = imageSource;
        });
    }
    // 별점 제거 함수
    resetStarPointImages(){
        this.renderStarPointImages();
    }
}

export default StarPoint;
