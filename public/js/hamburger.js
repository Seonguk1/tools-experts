// 모달과 버튼을 변수에 할당
const modal = document.getElementById("hamburger");
const openModalButton = document.getElementById("hamburgerbutton");

// "맞춤설정 및 제어" 버튼을 클릭하면 모달을 여는 함수
openModalButton.onclick = function() {
    modal.style.display = "block";
}
