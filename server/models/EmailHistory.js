const mongoose = require("mongoose");
const emailHistorySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    generatedEmail: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    emailBody: {
        type: String,
        required: true
    },
    linkedinDM: {
        type: String,
        required: true
    },
    followUpEmail: {
        type: String,
        required: true
    },
    tone: {
        type: String,
        enum: ['professional', 'casual', 'persuasive', 'humorous', 'urgent'],
        default: 'professional'
    },
    framework: {
        type: String,
        enum: ['aida', 'pas', 'bab', null],
        default: null
    },
}, { timestamps: true })
const EmailHistory = mongoose.model("EmailHistory", emailHistorySchema);

module.exports = EmailHistory;
