// 리스트안에서 엘리먼트의 인덱스 번호를 찾는 함수
const findIndexListElement = (element) => {
  const listItems = element.parentElement.querySelectorAll("li"); // NodeList를 반환
  const currentIndex = Array.prototype.slice
    .call(listItems)
    .findIndex((listItem) => listItem === element); //NodeList를 Array로 변환

  return currentIndex;
};

export default findIndexListElement;
