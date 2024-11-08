const buttons = document.getElementsByClassName("s_button-1");
const modes = document.getElementsByClassName("s_mode");

let lastClickedButton = null;
let con = document.getElementById("s_Daily");
buttons[0].style.backgroundColor = "white";
modes[1].style.display = "none";
modes[2].style.display = "none";

for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = handleButtonClick;
}

function handleButtonClick(event) {
    const clickedButton = event.target;
    if (lastClickedButton !== clickedButton) {
        resetButtonColors();
        if (clickedButton.getAttribute('value') === '0') {
            con = document.getElementById("s_Daily");
        } else if (clickedButton.getAttribute('value') === '1') {
            con = document.getElementById("s_Weekly");
        } else if (clickedButton.getAttribute('value') === '2') {
            con = document.getElementById("s_Month");
        }
        con.style.display = "block";
    }
    clickedButton.style.backgroundColor = "white";
    lastClickedButton = clickedButton;
}

function resetButtonColors() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "";
        modes[i].style.display = "none";
    }
}



const buttons_3 = document.getElementsByClassName("s_button-3");
const modes_2 = document.getElementsByClassName("s_mode_2");

let lastClickedButton_2 = null; // null로 초기화
let con_2 = document.getElementById("s_distance");
buttons_3[0].style.backgroundColor = "#A4E3D8";
modes_2[1].style.display = "none";
modes_2[2].style.display = "none";

for (let j = 0; j < buttons_3.length; j++) {
    buttons_3[j].onclick = handleButtonClick_2;
}

function handleButtonClick_2(event) {
    const clickedButton_2 = event.target;
    
    if (lastClickedButton_2 !== clickedButton_2) {
        resetButtonColors_2();
        
        // value 속성을 getAttribute로 가져오기
        if (clickedButton_2.getAttribute('value') === '0') {
            con_2 = document.getElementById("s_distance");
            console.log("1");
        } else if (clickedButton_2.getAttribute('value') === '1') {
            con_2 = document.getElementById("s_velocity");
            console.log("2");
        } else if (clickedButton_2.getAttribute('value') === '2') {
            con_2 = document.getElementById("s_etc");
            console.log("3");
        }
        
        con_2.style.display = "block";
    }
    
    clickedButton_2.style.backgroundColor = "#A4E3D8";
    lastClickedButton_2 = clickedButton_2;
}

function resetButtonColors_2() {
    for (let j = 0; j < buttons_3.length; j++) {
        buttons_3[j].style.backgroundColor = "#A4E3D899";
        modes_2[j].style.display = "none";
    }
}
