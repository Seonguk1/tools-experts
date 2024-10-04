
const buttons_5 = document.getElementsByClassName("s_button-5");
const modes_4 = document.getElementsByClassName("s_mode_4");

let lastClickedButton_4 = 0;
let con_4 = document.getElementById("s_distance-3");
buttons_5[0].style.backgroundColor="#E7E7E7";
modes_4[1].style.display = "none";
modes_4[2].style.display = "none";
modes_4[3].style.display = "none";
for(k=0; k<buttons_5.length; k++){
    buttons_5[k].onclick = handleButtonClick_4;
}

function handleButtonClick_4(event) {
    const clickedButton_4 = event.target;
    if (lastClickedButton_4 !== clickedButton_4) {
        resetButtonColors_4();
        if(event.target.value === '0'){
            con_4 = document.getElementById("s_distance-3");
            console.log("1");
        }
        else if(event.target.value === '1'){
            con_4 = document.getElementById("s_velocity-3");
            console.log("2");
        }
        else if(event.target.value === '2'){
            con_4 = document.getElementById("s_manner-3");
            console.log("3");
        }
        else if(event.target.value === '3'){
            con_4 = document.getElementById("s_activity-3");
            console.log("4");
        }
        con_4.style.display = "block";
    }
    clickedButton_4.style.backgroundColor = "#E7E7E7";
    lastClickedButton_4 = clickedButton_4;
}

function resetButtonColors_4() {
    for (let k = 0; k < buttons_5.length; k++) {
        buttons_5[k].style.backgroundColor = "";
        modes_4[k].style.display = "none";
    }
}





const buttons_4 = document.getElementsByClassName("s_button-4");
const modes_3 = document.getElementsByClassName("s_mode_3");

let lastClickedButton_3 = 0;
let con_3 = document.getElementById("s_distance-2");
buttons_4[0].style.backgroundColor="#E7E7E7";
modes_3[1].style.display = "none";
modes_3[2].style.display = "none";
modes_3[3].style.display = "none";
for(l=0; l<buttons_4.length; l++){
    buttons_4[l].onclick = handleButtonClick_3;
}

function handleButtonClick_3(event) {
    const clickedButton_3 = event.target;
    if (lastClickedButton_3 !== clickedButton_3) {
        resetButtonColors_3();
        if(event.target.value === '0'){
            con_3 = document.getElementById("s_distance-2");
            console.log("1");
        }
        else if(event.target.value === '1'){
            con_3 = document.getElementById("s_velocity-2");
            console.log("2");
        }
        else if(event.target.value === '2'){
            con_3 = document.getElementById("s_manner-2");
            console.log("3");
        }
        else if(event.target.value === '3'){
            con_3 = document.getElementById("s_activity-2");
            console.log("4");
        }
        con_3.style.display = "block";
    }
    clickedButton_3.style.backgroundColor = "#E7E7E7";
    lastClickedButton_3 = clickedButton_3;
}

function resetButtonColors_3() {
    for (let l = 0; l < buttons_4.length; l++) {
        buttons_4[l].style.backgroundColor = "";
        modes_3[l].style.display = "none";
    }
}


