function drawBarChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 30;
    const gap = 20;
    const maxDataValue = Math.max(...data);

    // Draw bars first
    data.forEach((value, index) => {
        const x = 50 + index * (barWidth + gap);
        const y = canvas.height - 30 - value;

        // Dynamic curve radius based on the value (to ensure it's always rounded)
        const curveRadius = Math.min(10, value / 5);  // 최대 반지름을 10으로 제한하고, value에 따라 크기 설정

        // Set color for the last bar
        if (index === data.length - 1) {
            ctx.fillStyle = "#95C7BF";
        } else {
            ctx.fillStyle = "#B6B6B6";
        }

        // Draw rounded bar (using path and arcTo)
        ctx.beginPath();
        ctx.moveTo(x, y + curveRadius);  // Starting point at the bottom-left with curve

        // Draw top-left corner (round)
        ctx.arcTo(x, y, x + barWidth, y, curveRadius);
        
        // Draw top-right corner (round)
        ctx.arcTo(x + barWidth, y, x + barWidth, y + value - curveRadius, curveRadius);
        
        // Draw the bottom-right corner (straight line)
        ctx.lineTo(x + barWidth, y + value);

        // Draw the bottom-left corner (straight line)
        ctx.lineTo(x, y + value);

        // Fill the path (the rounded rectangle)
        ctx.closePath();
        ctx.fill();

        // Add labels below the bars
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 10);
    });

    // Draw Y-axis labels
    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
        const yValue = (maxDataValue / yAxisSteps) * i;
        const yPos = canvas.height - 30 - (i * ((canvas.height - 40) / yAxisSteps));
        ctx.fillText(yValue.toFixed(0), 13, yPos);
    }

    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(40, canvas.height - 30); // X-axis is placed just above the bars
    ctx.lineTo(canvas.width - 10, canvas.height - 30); // End of X-axis at the bottom
    ctx.lineWidth = 8; // Thicker line for the X-axis
    ctx.strokeStyle = "#777777"; // Color for the X-axis
    ctx.lineCap = "round"; // Rounded ends for a smooth appearance
    ctx.stroke();
}
const data1 = [];
for(let i=0;i<6;i++){
    data1[i]=0;    
}
for(let i=0;i<running.length;i++){
    data1[5-i]= running[i].distance
}
// Sample data
const labels1 = ["1", "2", "3", "4", "5", "6"];

const data2 = [70, 130, 180, 60, 110, 150];
const labels2 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const data3 = [50, 90, 130, 40, 90, 120];
const labels3 = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

const data4 = [30, 60, 90, 30, 70, 100];
const labels4 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Draw the charts
drawBarChart("barchart", data1, labels1);
drawBarChart("barchart-daily", data2, labels2);
drawBarChart("barchart-weekly", data3, labels3);
drawBarChart("barchart-monthly", data4, labels4);
