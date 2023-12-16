const twilio = require('twilio');
const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
    
const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(phoneNumber, message) {
    try {
        const notification = await client.messages.create({
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: message
        });
        console.log(notification);
    } catch (e) {
        console.error(e);
    }
}

async function sendPushNotification(tokens, title, body) {
    try {
        const message = {
            notification: { title, body },
            tokens
        };
        const response = await admin.messaging().send(message);
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    sendSMS,
    sendPushNotification
};