// const axios = require("axios");

// /**
//  * Trigger a Retail AI agent call to a given phone number.
//  * @param {Object} params
//  * @param {string} params.phone - Customer phone number (without country code)
//  * @param {string} params.name - Customer name
//  */
// async function triggerRetailAIAgent({ phone, name }) {
//   try {
//     if (!process.env.Retail_api_Key) {
//       throw new Error("Retail API key is not set in environment variables");
//     }

//     const fromNumber = process.env.RETELL_PHONE_NUMBER || "+15394495356"; // verified number

//     const payload = {
//       from_number: fromNumber,
//       to_number: `+91${phone}`,
//       metadata: { customer_name: name },
//       script: `Hi ${name}, it was great speaking with you! I specialize in helping homeowners like you sell quickly and for top dollar.`,
//       voice: "standard",
//       stage: "stage_1",
//     };

//     const response = await axios.post(
//       "https://5baaae0584c4.ngrok-free.app/webhook",
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.Retail_api_Key, // ✅ correct header
//         },
//         validateStatus: () => true, // prevent axios from throwing on non-200
//       }
//     );

//     // Log full response for debugging
//     console.log("📄 Raw Retail AI response:", response.status, response.data);

//     if (response.status !== 200 && response.status !== 201) {
//       throw new Error(`Retail AI API returned status ${response.status}: ${JSON.stringify(response.data)}`);
//     }

//     console.log("✅ Retail AI agent call triggered successfully:", response.data);
//     return response.data;
//   } catch (err) {
//     console.error("❌ Error triggering Retail AI agent call:", err.message || err);
//     return null;
//   }
// }

// module.exports = { triggerRetailAIAgent };
