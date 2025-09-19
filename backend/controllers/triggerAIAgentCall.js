const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function triggerAIAgentCall({ phone, name }) {
  try {
    const call = await client.calls.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
      url: `${process.env.BASE_URL}/voice-response?name=${encodeURIComponent(name)}`,
      machineDetection: "Enable"
    });

    console.log("📞 AI Call triggered:", call.sid);
    return call.sid;
  } catch (err) {
    console.error("❌ Error triggering AI call:", err);
    return null;
  }
}

module.exports = { triggerAIAgentCall };
