let now = new Date();
let sel_day = -6;
now.setDate(now.getDate()+ sel_day);

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];




const buttonContainer = document.getElementById('s_Weekly');
const originalbutton = document.getElementById("s_originalbutton");

for(let i=0; i<7; i++){
    const today = {
        year: now.getFullYear(),
        date: now.getDate(),
        month: now.getMonth(),
        day: now.getDay()
    }
    
    const newbutton = originalbutton.cloneNode(true);
    newbutton.style.display = "inline";
    newbutton.querySelector('#s_date').textContent = today.date;
    newbutton.querySelector('#s_year').textContent = today.year;
    newbutton.querySelector('#s_month').textContent = months[today.month];
    newbutton.querySelector('#s_day').textContent = days[today.day];
    buttonContainer.appendChild(newbutton);
    
    now.setDate(now.getDate()+ 1);
}
