const mongoose = require("mongoose");

const runningSchema = new mongoose.Schema({
    timestamp: {
        start: { type: Date, required: true }, // 시작 시간
        end: { type: Date, required: true },   // 종료 시간
    },
    route: [
        {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
    ],
    distance: { type: Number, required: true }, // 총 거리 (km)
    score: { type: Number, required: true },    // 점수
    avg_pace: { type: Number },                 // 평균 페이스 (분/km)
    calorie: { type: Number },                  // 소모 칼로리
    taken_time: { type: Number },               // 총 시간 (초)
    date: { type: Date, default: Date.now },    // 실행 날짜
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    week_of_year: { type: Number }, // 서버에서 자동 계산
    month: { type: Number },        // 서버에서 자동 계산
    year: { type: Number },         // 서버에서 자동 계산
});

module.exports = mongoose.model("Running", runningSchema);
