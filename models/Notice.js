const NoticeSchema = new mongoose.Schema({
    writer : String,
    title : String,
    content : String,
    noticeToken : String,
    writeDate : { type : Date, default : new Date() }
});


Notices = mongoose.model('notices', NoticeSchema);