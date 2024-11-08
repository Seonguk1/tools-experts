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





