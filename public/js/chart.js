function drawBarChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    let barWidth;
    let gap;

    if (canvasId === "barchart-daily") {
        barWidth = 25.45; // 막대 너비
        gap = 16.9; // 막대 간 간격
    }
    else if (canvasId === "barchart-weekly") {
        barWidth = 30; // 막대 너비
        gap = 20; // 막대 간 간격
    }
    else if (canvasId === "barchart-monthly") {
        barWidth = 14.48; // 막대 너비
        gap = 9.65; // 막대 간 간격
    }  
    else {
        barWidth = 30; // 막대 너비
        gap = 20; // 막대 간 간격
    }

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
        ctx.fillStyle = "#95C7BF";

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
        ctx.fillText(yValue.toFixed(0), 25, yPos + 5); // Y축 값
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
const recent_records_distance = [0,0,0,0,0,0,0];
const recent_records_date = ["","","","","","", ""];
const this_week_records_distance = [0,0,0,0,0,0,0];
const this_week_records_label = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const this_month_records_distance = [0,0,0,0,0,0];
const this_month_records_label = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const this_year_records_distance =[0,0,0,0,0,0,0,0,0,0,0,0];
const this_year_records_label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const todayDate = new Date();
const firstDayOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1).getDay();
let is_this_week = true;

running.forEach((record, index)=>{
    let recordDate = new Date(record.date)
    let difference_date = dateDifference(recordDate, todayDate)
    // 최근 기록
    if(index<6){
        recent_records_distance[5-index] = record.distance;
        
        recent_records_date[5-index] = recordDate.getMonth()+1+"."+recordDate.getDate();
    }

    // 이번 주 기록
    if(difference_date<7 && is_this_week){
        this_week_records_distance[recordDate.getDay()]+= record.distance;
        if(recordDate.getDay() == 0){
            is_this_week = false;
        }
    }

    // 이번 달 기록
    if(difference_date<31 && recordDate.getMonth == todayDate.getMonth){
        let a = Math.floor(recordDate.getDate()/7);
        let b = recordDate.getDate() % 7;
        if(b>7-firstDayOfMonth){
            this_month_records_distance[a+1] += record.distance;
        }
        else{
            this_month_records_distance[a] += record.distance;
        }
    }

    //이번 연도 기록
})

// Draw the charts
drawBarChart("barchart", recent_records_distance, recent_records_date);
drawBarChart("barchart-daily", this_week_records_distance, this_week_records_label);
drawBarChart("barchart-weekly", this_month_records_distance, this_month_records_label);
drawBarChart("barchart-monthly", this_year_records_distance, this_year_records_label);
