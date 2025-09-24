// const axios = require("axios");

// // Trigger Retell AI call directly from backend
// async function triggerRetailAIWebhook({ name, phone, email, city }) {
//   try {
//     // Validate and format phone to E.164 (India default +91)
//     const phoneClean = phone.replace(/\D/g, ""); // keep digits only
//     if (!phoneClean.match(/^\d{10,15}$/)) {
//       throw new Error("Invalid phone number. Must be 10–15 digits.");
//     }
//     const formattedPhone = phone.startsWith("+") ? phone : `+91${phoneClean}`;

//     // Payload for Retell AI call
//     const payload = {
//       from_number: process.env.Retail_PHONE_NUMBER, // your registered caller ID with Retell
//       to_number: formattedPhone, 
//       agent_id: process.env.RETAIL_AGENT_ID, 
//       metadata: {
//         name,
//         email,
//         city,
//       },
//     };
//     const response = await axios.post(
//       "https://api.retellai.com/v2/call",//not found as of now cus of domain nme
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.Retail_api_Key}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Retell AI call triggered:", response.data);
//     return response.data;
//   } catch (err) {
//     console.error(" Error triggering Retell AI call:", err.response?.data || err.message);
//     throw err;
//   }
// }

// module.exports = { triggerRetailAIWebhook };
