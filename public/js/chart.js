function drawBarChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 30;
    const gap = 20;
    const maxDataValue = Math.max(...data);

    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, canvas.height - 30);
    ctx.stroke();

    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
        const yValue = (maxDataValue / yAxisSteps) * i;
        const yPos = canvas.height - 30 - (i * ((canvas.height - 40) / yAxisSteps));
        ctx.fillText(yValue.toFixed(0), 13, yPos);
    }
    ctx.beginPath();
    ctx.moveTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.stroke();

    data.forEach((value, index) => {
        const x = 50 + index * (barWidth + gap);
        const y = canvas.height - 30 - value;

        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x, y, barWidth, value);

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 10);
    });
}

const data1 = [100, 150, 200, 80, 120, 170];
const labels1 = ["1", "2", "3", "4", "5", "6"];

const data2 = [70, 130, 180, 60, 110, 150];
const labels2 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const data3 = [50, 90, 130, 40, 90, 120];
const labels3 = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

const data4 = [30, 60, 90, 30, 70, 100];
const labels4 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

drawBarChart("barchart", data1, labels1);
drawBarChart("barchart-daily", data2, labels2);
drawBarChart("barchart-weekly", data3, labels3);
drawBarChart("barchart-monthly", data4, labels4);