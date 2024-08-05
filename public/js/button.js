
const buttons = document.getElementsByClassName("s_button-1");
const modes = document.getElementsByClassName("s_mode");

let lastClickedButton = 0;
let con = document.getElementById("s_Daily");
buttons[0].style.backgroundColor="#fcb101";
modes[1].style.display = "none";
modes[2].style.display = "none";
for(i=0; i<buttons.length; i++){
    buttons[i].onclick = handleButtonClick;
}

function handleButtonClick(event) {
    const clickedButton = event.target;
    if (lastClickedButton !== clickedButton) {
        resetButtonColors();
        if(event.target.value === '0'){
            con = document.getElementById("s_Daily");
            console.log("1");
        }
        else if(event.target.value === '1'){
            con = document.getElementById("s_Weekly");
            console.log("2");
        }
        else if(event.target.value === '2'){
            con = document.getElementById("s_Month");
            console.log("3");
        }
        con.style.display = "block";
    }
    clickedButton.style.backgroundColor = "#fcb101";
    lastClickedButton = clickedButton;
}

function resetButtonColors() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "";
        modes[i].style.display = "none";
    }
}


