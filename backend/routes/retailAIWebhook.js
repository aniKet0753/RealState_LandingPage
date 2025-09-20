// const express = require('express');
// const router = express.Router();
// const supabase = require('../db/supabaseClient');

// // Middleware to parse JSON body
// router.use(express.json());

// // Webhook to handle Retail AI events
// router.post('/webhook', async (req, res) => {
//   try {
//     const event = req.body;

//     console.log(" Retail AI Webhook Event Received:", event);

//     const { phone_number, status, agent_id, lead_id } = event;

//     // Example: update lead status in Supabase
//     if (phone_number && status) {
//       const { data, error } = await supabase
//         .from('leads')
//         .update({ status: status })  // update status sent by Retail AI
//         .eq('phone_number', phone_number);

//       if (error) {
//         console.error(' Supabase update error:', error);
//         return res.status(500).json({ message: 'Failed to update lead status' });
//       }

//       console.log(` Lead with phone ${phone_number} updated to status "${status}"`);
//     }

//     res.status(200).json({ message: 'Webhook received successfully' });
//   } catch (err) {
//     console.error(' Error handling webhook:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;
