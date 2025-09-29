const cron = require('node-cron');
const Reminder = require('../models/reminder');
const User = require('../models/user');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize FCM
const serviceAccount = require('../fcm-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

cron.schedule('* * * * *', async () => { // Every minute for demo
    const reminders = await Reminder.find({ sent: false, remindAt: { $lte: new Date() } }).populate('userId');
    reminders.forEach(async (reminder) => {
        const user = reminder.userId;

        // Twilio SMS
        await twilioClient.messages.create({ body: reminder.message, from: process.env.TWILIO_PHONE, to: user.phone });

        // SendGrid Email
        await sgMail.send({ to: user.email, from: 'noreply@credosafe.com', subject: 'Reminder', text: reminder.message });

        // FCM Push Notification
        await admin.messaging().send({ token: user.fcmToken, notification: { title: 'Reminder', body: reminder.message } });

        reminder.sent = true;
        await reminder.save();
    });
});
