// const express = require("express");
// const router = express.Router();
// const { triggerRetailAIWebhook } = require("../routes/retailAIWebhook"); 

// router.post("/trigger-call", async (req, res) => {
//   const { name, phone, email, city } = req.body;
//   if (!name || !phone) {
//     return res.status(400).json({ error: "Name and phone are required" });
//   }
//   try {
//     const response = await triggerRetailAIWebhook({ name, phone, email, city });
//     res.status(200).json({ message: "Retail AI call triggered", data: response });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
