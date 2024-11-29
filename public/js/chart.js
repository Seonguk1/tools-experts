function drawBarChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    const barWidth = 30; // 막대 너비
    const gap = 20; // 막대 간 간격
    const canvasWidth = data.length * (barWidth + gap) + 50; // 캔버스 너비 동적 설정
    canvas.width = canvasWidth; // 데이터에 따라 캔버스 크기 설정

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxDataValue = Math.max(...data);
    const yAxisMaxValue = maxDataValue; // Y축 최댓값을 데이터 최댓값으로 설정

    // 막대 그리기
    data.forEach((value, index) => {
        const x = 50 + index * (barWidth + gap);
        const barHeight = (value / yAxisMaxValue) * (canvas.height - 60); // 막대 높이 계산
        const y = canvas.height - 30 - barHeight;

        // 동그란 상단을 만들기 위해 radius를 설정
        const curveRadius = 10; // 상단 둥근 반지름

        // 막대 스타일 설정
        ctx.fillStyle = index === data.length - 1 ? "#95C7BF" : "#B6B6B6";

        // 둥근 상단을 가진 직사각형 그리기
        ctx.beginPath();
        ctx.moveTo(x, y + curveRadius);  // 시작점 (왼쪽 하단)
        
        // 상단 왼쪽 모서리 둥글게 그리기
        ctx.arcTo(x, y, x + barWidth, y, curveRadius);
        
        // 상단 오른쪽 모서리 둥글게 그리기
        ctx.arcTo(x + barWidth, y, x + barWidth, y + barHeight - curveRadius, curveRadius);

        // 하단 직선 그리기
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.lineTo(x, y + barHeight);

        ctx.closePath();
        ctx.fill();

        // 레이블 추가 (막대 아래)
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 10);
    });

    // Y축 레이블 추가
    const yAxisSteps = 5;
    const stepValue = yAxisMaxValue / yAxisSteps; // Y축 한 칸당 값
    for (let i = 0; i <= yAxisSteps; i++) {
        const yValue = stepValue * i;
        const yPos = canvas.height - 30 - (i * ((canvas.height - 60) / yAxisSteps));
        ctx.fillStyle = "#000000";
        ctx.textAlign = "right";
        ctx.fillText(yValue.toFixed(0), 40, yPos + 5); // Y축 값
    }

    // X축 그리기
    ctx.beginPath();
    ctx.moveTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#777777";
    ctx.lineCap = "round";
    ctx.stroke();
}
function dateDifference(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24))
}
const recent_records_distance = [0,0,0,0,0,0];
const recent_records_date = ["","","","","",""];
const this_week_records_distance = [0,0,0,0,0,0,0];
const this_week_records_day = [];
const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayDate = new Date();
// let record = null;

// 이번주 요일 
let day = todayDate.getDay();
for(let i=0;i<7;i++){
    if(day==-1){
        day=6
    }
    this_week_records_day[6-i] = dayList[day];
    day--;
}

running.forEach((record, index)=>{
    // 최근 기록
    if(index<6){
        recent_records_distance[5-index] = running[index].distance;
        const date = new Date(running[index].date)
        recent_records_date[5-index] = date.getMonth()+1+"."+date.getDate();
    }

    // 이번주 기록
    let difference_date = dateDifference(new Date(record.date), todayDate)
    if(difference_date<7){
        this_week_records_distance[6-difference_date]+= record.distance;
    }
})

const data3 = [50, 90, 130, 40, 90, 120];
const labels3 = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

const data4 = [30, 60, 90, 30, 70, 100];
const labels4 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Draw the charts
drawBarChart("barchart", recent_records_distance, recent_records_date);
drawBarChart("barchart-daily", this_week_records_distance, this_week_records_day);
drawBarChart("barchart-weekly", data3, labels3);
drawBarChart("barchart-monthly", data4, labels4);
