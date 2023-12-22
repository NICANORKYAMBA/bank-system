import twilio from 'twilio';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'serviceAccountKey.json'), 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS (phoneNumber, message) {
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

export async function sendPushNotification (tokens, title, body) {
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
