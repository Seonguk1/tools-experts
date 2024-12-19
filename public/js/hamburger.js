// 모달과 버튼을 변수에 할당
const modal = document.getElementById("hamburger");
const openModalButton = document.getElementById("hamburgerbutton");

// "맞춤설정 및 제어" 버튼을 클릭하면 모달을 여는 함수
let k=0;
openModalButton.onclick = function() {
    if(k%2==0){
        modal.style.display = "block";
    }
    else{
        modal.style.display = "none";
    }
    k=k+1;
}
