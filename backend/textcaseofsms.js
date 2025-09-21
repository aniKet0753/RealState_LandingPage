const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS() {
  try {
    const message = await client.messages.create({
      body: "test case message for tiwilio  backend from a file",   
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+919122503536"//your number shouild be here        
    });

    console.log(" Message SID:", message.sid);
  } catch (err) {
    console.error(" Error:", err);
  }
}
// run this exact file for testig
sendSMS();
