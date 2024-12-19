const optionButtons = document.getElementsByClassName("option-button");
const contentSections = document.getElementsByClassName("content-section");

let lastClickedButton_4 = null;
let activeSection = document.getElementById("section-mine");
optionButtons[0].style.backgroundColor = "#A4E3D8";
contentSections[1].style.display = "none";

for (let k = 0; k < optionButtons.length; k++) {
    optionButtons[k].onclick = handleOptionButtonClick;
}

function handleOptionButtonClick(event) {
    const clickedButton_4 = event.target;
    if (lastClickedButton_4 !== clickedButton_4) {
        resetButtonColors_4();
        if (clickedButton_4.getAttribute('value') === '0') {
            activeSection = document.getElementById("section-mine");
        } else if (clickedButton_4.getAttribute('value') === '1') {
            activeSection = document.getElementById("section-new");
        }
        activeSection.style.display = "block";
    }
    clickedButton_4.style.backgroundColor = "#A4E3D8";
    lastClickedButton_4 = clickedButton_4;
}

function resetButtonColors_4() {
    for (let k = 0; k < optionButtons.length; k++) {
        optionButtons[k].style.backgroundColor = "#698882";
        contentSections[k].style.display = "none";
    }
}