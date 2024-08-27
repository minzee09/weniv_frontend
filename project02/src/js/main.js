// IIFE 즉시 실행 함수 - 변수 스코프를 보호하고 전역 변수를 오염시키지 않기 위해 사용+바로 실행됨
(() => {
    const carouselUI = document.querySelector(".carousel-list");
    const imageInput = document.querySelector("#image-upload-input");
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");

    function changeTransform() {
        const items = document.querySelectorAll(".carousel-item");

        items.forEach((e, i) => {
            let degree = 360 / items.length;

            if(items.length > 1){
                if(i == 0){
                    e.style.transform = "rotateY(0deg) translateZ(250px)";
                } else {
                    e.style.transform = `rotateY(${degree * i}deg) translateZ(250px) rotateY(-${degree * i}deg)`;
                }
            }

            if(items.length >= 5){
                if(i == 0){
                    e.style.transform = "rotateY(0deg) translateZ(250px)";
                } else if (i == 1){
                    e.style.transform = "rotateY(72deg) translateZ(250px) rotateY(-72deg)";
                } else if (i == 2){
                    e.style.transform = "rotateY(144deg) translateZ(250px) rotateY(-144deg) translateX(400px)";
                } else if (i == items.length - 2){
                    e.style.transform = "rotateY(216deg) translateZ(250px) rotateY(-216deg) translateX(-400px)";
                } else if (i == items.length - 1){
                    e.style.transform = "rotateY(288deg) translateZ(250px) rotateY(-288deg)";
                } else {
                    e.style.transform = `rotateY(${degree * i}deg) translateZ(250px) rotateY(-${degree * i}deg)`;
                }
            }
        });
    }

    function moveNext(){
        const items = document.querySelectorAll(".carousel-item"); //배열 처리

        if (items.length > 1){
            const currentItem = document.querySelector(".now");
            const next = currentItem.nextElementSibling;  //다음 요소
            carouselUI.appendChild(currentItem) //이 요소(리스트)의 가장 마지막 자식 요소로 들어가게 됨
            currentItem.classList.remove('now');
            next.classList.add('now');
        }
        changeTransform()
    }

    function movePrev(){
        const items = document.querySelectorAll(".carousel-item");

        if (items.length > 1){ 
            const currentItem = document.querySelector(".now");
            const lastItem = carouselUI.lastElementChild;

            carouselUI.insertBefore(lastItem, items[0]);
            currentItem.classList.remove('now');
            lastItem.classList.add('now');
        }
        changeTransform()
    }

    function createTag(url) {
        // <li> 요소를 생성합니다.
        const list = document.createElement('li');
        // <img> 요소를 생성합니다.
        const img = document.createElement('img');
        // 생성된 <li> 요소에 "carousel-item" 클래스를 추가합니다.
        list.classList.add("carousel-item");
        // <img> 요소의 src 속성에 전달된 URL을 할당합니다.
        img.src = url;
        // <li> 요소에 <img> 요소를 자식 요소로 추가합니다.
        list.appendChild(img);
    
        // 현재 문서 내의 모든 "carousel-item" 클래스를 가진 요소를 선택합니다.
        const items = document.querySelectorAll(".carousel-item");
        // 각 "carousel-item" 요소에서 "now" 클래스를 제거합니다.
        items.forEach(item => {
            item.classList.remove('now');
        });
        // 새로 생성한 <li> 요소에 "now" 클래스를 추가합니다.
        list.classList.add("now");
    
        // 최종적으로 새로 생성한 <li> 요소를 반환합니다.
        return list;
    }
    
    function uploadImg(value) {
        // 현재 문서 내의 모든 "carousel-item" 클래스를 가진 요소를 선택합니다.
        const items = document.querySelectorAll(".carousel-item");
    
        // 파일이 업로드되었는지 확인합니다.
        if (value.files) {
            // FileReader 객체를 생성하여 파일을 읽을 준비를 합니다.
            const reader = new FileReader();
    
            // 파일이 로드되었을 때 실행되는 콜백 함수입니다.
            reader.onload = e => {
                // 파일이 로드된 후, 결과(이미지 URL)를 가져옵니다.
                const imgUrl = e.target.result;
                // carouselUI의 첫 번째 아이템 앞에 새로운 이미지 태그를 삽입합니다.
                carouselUI.insertBefore(createTag(imgUrl), items[0]);
                changeTransform();
            };
            // 사용자가 선택한 첫 번째 파일을 읽어 이미지 URL로 변환합니다.
            reader.readAsDataURL(value.files[0]);
        }
    }

    imageInput.addEventListener("change", e => {
        uploadImg(e.target);
    })
    nextButton.addEventListener("click", moveNext)
    prevButton.addEventListener("click", movePrev)
    
    window.onload = () =>{
        changeTransform();
    }
})()