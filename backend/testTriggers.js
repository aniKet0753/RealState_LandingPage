// require("dotenv").config();
// const fetch = require("node-fetch"); // Node 18+ has global fetch
// const twilio = require("twilio");
// require("dotenv").config();


// async function testRetailAI({phone, name}) {
//   try {
//         if (!process.env.Retail_api_Key) {
//       throw new Error("Retail API key is not set in environment variables");
//     }
//         const fromNumber = process.env.RETELL_PHONE_NUMBER; 

//     const response = await fetch("https://5baaae0584c4.ngrok-free.app/webhook", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.Retail_api_Key,
//       },
//       body: JSON.stringify({
//         from_number: process.env.RETELL_PHONE_NUMBER,
//         to_number: `+91${phone}`,
//         metadata: { customer_name: name },
//         script: `Hi ${name}, it was great speaking with you! I specialize in helping homeowners like you sell quickly and for top dollar.`
//       }),
//     });
//   const text = await response.text();
//   console.log(text);
//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(`Retail AI API error: ${JSON.stringify(data)}`);
//     }

//     console.log(" Retail AI call triggered successfully:", data);
//   } catch (err) {
//     console.error(" Retail AI error:", err);
//   }
// }
// async function testTwilioSMS(phone, message) {
//   try {
//     const client = twilio(
//       process.env.TWILIO_ACCOUNT_SID,
//       process.env.TWILIO_AUTH_TOKEN
//     );
//     const sms = await client.messages.create({
//       body: message,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: `+91${phone}`,
//     });

//     console.log(" Twilio SMS sent successfully:", sms.sid);
//   } catch (err) {
//     console.error(" Twilio SMS error:", err);
//   }
// }

// (async () => {
//   const testPhone = "9122503536";
//   const testName = "dbd hddh";
//   const testMessage = "yoooooooooo.";

//   console.log("Testing Retail AI call...");
//   await testRetailAI(testPhone, testName);


//   console.log("\nTwilio SMS...");


//   await testTwilioSMS(testPhone, testMessage);
// })();
