// require("dotenv").config();
// const twilio = require("twilio");
// console.log("SID:", process.env.TWILIO_ACCOUNT_SID?.slice(0,6));
// console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN?.slice(0,4));
// console.log("FROM:", process.env.TWILIO_PHONE_NUMBER);
// console.log(JSON.stringify(process.env.TWILIO_AUTH_TOKEN));


// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// client.api.accounts(process.env.TWILIO_ACCOUNT_SID)
//   .fetch()
//   .then(account => console.log(" Authenticated! Account name:", account.friendlyName))
//   .catch(err => console.error(" Auth failed:", err));

// client.messages
//   .create({
//     body: "Test SMS",
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: "+919122503536" // replace with your personal number
//   })
//   .then(msg => console.log(" SMS sent:", msg.sid))
//   .catch(err => console.error(" Error:", err));
