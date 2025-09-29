const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    remindAt: { type: Date, required: true },
    sent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
