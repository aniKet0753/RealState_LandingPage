// const express = require('express');
// const axios = require('axios');
// const Groq = require('groq-sdk');
// const router = express.Router();
// const authenticateToken = require('../middleware/auth');

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // sessions: sessionId -> { leadData, step, confirmed, editing, awaitingFieldNumber, resumeToConfirmation }
// const conversations = {};

// // Mandatory & Optional fields
// const mandatoryFields = ["first_name", "last_name", "email", "phone_number", "type"];
// const optionalFields = [
//   "status", "source", "notes", "property_type", "budget_range",
//   "preferred_location", "bedrooms", "bathrooms", "timeline", "social_media"
// ];
// const allFields = [...mandatoryFields, ...optionalFields];

// // Enum mappings
// const enumMappings = {
//   status: ['New', 'Nurturing', 'Qualified', 'Lost', 'Contacted'],
//   source: ['Referral', 'SocialMedia', 'Website', 'Zillow', 'Other'],
//   type: ['Buyer', 'Seller', 'Investor'],
// };

// // Field examples
// const fieldExamples = {
//   first_name: "John",
//   last_name: "Doe",
//   email: "john@example.com",
//   phone_number: "9876543210",
//   type: "Buyer",
//   status: "Nurturing",
//   source: "Referral",
//   notes: "Looking for resale flat",
//   property_type: "Apartment",
//   budget_range: "50-70L",
//   preferred_location: "Bangalore",
//   bedrooms: "3",
//   bathrooms: "2",
//   timeline: "Within 6 months",
//   social_media: '{"facebook":"fb.com/johndoe"}'
// };

// function normalizeEnum(field, value) {
//   if (value == null) return null;
//   const validValues = enumMappings[field];
//   if (!validValues) return value;
//   const match = validValues.find(v => (value + '').toLowerCase() === v.toLowerCase());
//   return match || value;
// }

// // Advance step to next missing field (so we don't re-ask filled fields)
// function advanceStep(session) {
//   while (
//     session.step < allFields.length &&
//     Object.prototype.hasOwnProperty.call(session.leadData, allFields[session.step])
//   ) {
//     session.step++;
//   }
// }

// // Build numbered summary
// function buildSummary(leadData) {
//   return allFields
//     .map((k, i) => `${i + 1}. ${k}: ${leadData[k] === undefined ? null : leadData[k]}`)
//     .join("\n");
// }

// // ---- AI Validation ----
// async function validateWithGroq(field, userInput) {
//   const isMandatory = mandatoryFields.includes(field);

//   // optional skip
//   if (userInput && userInput.toLowerCase() === "skip" && !isMandatory) {
//     return { valid: true, value: null };
//   }
//   // mandatory cannot skip
//   if (userInput && userInput.toLowerCase() === "skip" && isMandatory) {
//     return { valid: false, error: `${field} is mandatory, cannot skip.` };
//   }

//   const systemPrompt = `
// You are a strict validator. 
// Field: ${field}
// User value: "${userInput}"

// Rules:
// - For email → must be a valid email.
// - For phone_number → must be exactly 10 digits.
// - For type/status/source → must be one of ${JSON.stringify(enumMappings[field] || [])}.
// - For bedrooms/bathrooms → must be integer or null.
// - For social_media → if a JSON-looking string is provided, keep it as-is; do not modify structure.
// - For names/notes/other free-text → return cleaned text (trimmed).
// - If valid: return {"valid": true, "value": "cleaned_value"}
// - If invalid: return {"valid": false, "error": "reason"}
// Only return JSON.
// `;

//   const completion = await groq.chat.completions.create({
//     model: "openai/gpt-oss-20b",
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userInput || "" }
//     ],
//     temperature: 0,
//     max_tokens: 200,
//   });

//   let content = completion.choices[0]?.message?.content || "{}";
//   try {
//     return JSON.parse(content);
//   } catch {
//     return { valid: false, error: "Could not parse validation response" };
//   }
// }

// // ---- MAIN ROUTE ----
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { userInput = "", sessionId } = req.body;
//     if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

//     if (!conversations[sessionId]) {
//       conversations[sessionId] = {
//         leadData: {},
//         confirmed: false,
//         step: 0,
//         editing: null,
//         awaitingFieldNumber: false,
//         resumeToConfirmation: false
//       };
//     }
//     const session = conversations[sessionId];

//     // Always advance over already-filled fields
//     advanceStep(session);

//     let aiResponse = "";
//     let awaitingConfirmation = false;

//     // ---- Handle editing confirmation number -> set field to edit ----
//     if (session.awaitingFieldNumber && userInput && !isNaN(userInput)) {
//       const idx = parseInt(userInput, 10) - 1;
//       if (idx >= 0 && idx < allFields.length) {
//         session.editing = idx;
//         session.awaitingFieldNumber = false;

//         const fieldName = allFields[idx];
//         aiResponse = `Please provide a new value for ${fieldName} (example: ${fieldExamples[fieldName]})`;
//         if (enumMappings[fieldName]) {
//           aiResponse += ` | Options: ${enumMappings[fieldName].join(", ")}`;
//         }
//         if (!mandatoryFields.includes(fieldName)) {
//           aiResponse += `. Type "skip" to leave it blank.`;
//         }

//         return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//       } else {
//         aiResponse = "❌ Invalid field number. Please enter a valid number from the summary.";
//         return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//       }
//     }

//     // ---- Handle editing flow (user provides new value) ----
//     if (session.editing !== null && userInput) {
//       const fieldToEdit = allFields[session.editing];
//       const validation = await validateWithGroq(fieldToEdit, userInput);

//       if (!validation.valid) {
//         return res.json({
//           aiResponse: `❌ Invalid ${fieldToEdit}: ${validation.error}. Please try again.`,
//           leadData: session.leadData,
//           awaitingConfirmation: false
//         });
//       }

//       let value = validation.value;

//       if (enumMappings[fieldToEdit]) value = normalizeEnum(fieldToEdit, value);

//       // normalize numbers
//       if ((fieldToEdit === "bedrooms" || fieldToEdit === "bathrooms")) {
//         value = (value === null || value === "" || value === "null") ? null : parseInt(value, 10);
//         if (Number.isNaN(value)) value = null;
//       }

//       // social_media → try to parse JSON if provided
//       if (fieldToEdit === "social_media" && value) {
//         try {
//           value = JSON.parse(value);
//         } catch {
//           // if not valid JSON, keep as-is or set null
//           // Here we keep as raw string; backend can reject if needed.
//         }
//       }

//       session.leadData[fieldToEdit] = value;
//       session.editing = null;

//       // After edit, return to confirmation
//       const summary = buildSummary(session.leadData);
//       aiResponse = `✅ Field updated.\n\nHere are the updated details:\n${summary}\n\nWould you like to confirm this lead? (Yes/No)`;
//       return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: true });
//     }

//     // ---- If all fields are collected, handle confirmation / summary / edit-number prompt ----
//     if (session.step >= allFields.length) {
//       // if resuming to confirmation after fixing a duplicate
//       if (session.resumeToConfirmation) {
//         session.resumeToConfirmation = false;
//         const summary = buildSummary(session.leadData);
//         aiResponse = `Here are the updated details:\n${summary}\n\nWould you like to confirm this lead? (Yes/No)`;
//         return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: true });
//       }

//       // YES -> try save
//       if (userInput.toLowerCase() === "yes" && !session.confirmed) {
//         const payload = { ...session.leadData, user_id: req.user?.userId };

//         try {
//           const leadResp = await axios.post(
//             `${process.env.BACKEND_URL}/api/leads/add-lead-by-ai`,
//             payload,
//             { headers: { Authorization: req.headers.authorization || '' } }
//           );
//         //   console.log(leadResp.data);
//           aiResponse = `🎉 Lead created successfully! Lead ID: ${leadResp.data.id || 'N/A'}`;
//           session.confirmed = true;
//           delete conversations[sessionId];
//           return res.json({ aiResponse, leadData: payload, awaitingConfirmation: false });
//         } catch (err) {
//           const serverErr = err.response?.data?.error || err.message || "Unknown error";

//           if (serverErr.includes("leads_email_key")) {
//             // email duplicate -> ask for just email, then jump back to confirmation
//             aiResponse = "❌ This email already exists. Please provide a different email (example: john2@example.com).";
//             const idx = allFields.indexOf("email");
//             if (idx >= 0) {
//               delete session.leadData.email;
//               session.step = idx;
//               session.resumeToConfirmation = true;
//             }
//             return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//           }

//           if (serverErr.includes("leads_phone_number_key")) {
//             // phone duplicate -> ask for just phone, then jump back to confirmation
//             aiResponse = "❌ This phone number already exists. Please provide a different phone number (example: 9876543210).";
//             const idx = allFields.indexOf("phone_number");
//             if (idx >= 0) {
//               delete session.leadData.phone_number;
//               session.step = idx;
//               session.resumeToConfirmation = true;
//             }
//             return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//           }

//           aiResponse = `❌ Failed to create lead: ${serverErr}`;
//           return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: true });
//         }
//       }

//       // NO -> show numbered summary and ask for field number to edit
//       if (userInput.toLowerCase() === "no" && !session.confirmed) {
//         const summary = buildSummary(session.leadData);
//         aiResponse = `Here are the fields:\n${summary}\n\nPlease enter the field number you want to edit:`;
//         session.awaitingFieldNumber = true;
//         return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//       }

//       // Otherwise, show confirmation prompt again
//       const summary = buildSummary(session.leadData);
//       aiResponse = `Here are the details I have:\n${summary}\n\nWould you like to confirm this lead? (Yes/No)`;
//       return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: true });
//     }

//     // ---- Collect next field ----
//     const currentField = allFields[session.step];

//     // If user provided input for the current field (or we returned due to duplicate fix)
//     if (userInput) {
//       const validation = await validateWithGroq(currentField, userInput);

//       if (!validation.valid) {
//         aiResponse = `❌ Invalid ${currentField}: ${validation.error}. Please try again.`;
//         let hint = ` (example: ${fieldExamples[currentField]})`;
//         if (enumMappings[currentField]) {
//           hint += ` | Options: ${enumMappings[currentField].join(", ")}`;
//         }
//         if (!mandatoryFields.includes(currentField)) {
//           hint += `. Type "skip" to leave it blank.`;
//         }
//         aiResponse += hint;
//         return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//       }

//       let value = validation.value;

//       if (enumMappings[currentField]) value = normalizeEnum(currentField, value);

//       // normalize numbers
//       if ((currentField === "bedrooms" || currentField === "bathrooms")) {
//         value = (value === null || value === "" || value === "null") ? null : parseInt(value, 10);
//         if (Number.isNaN(value)) value = null;
//       }

//       // social_media → try to parse JSON if provided
//       if (currentField === "social_media" && value) {
//         try {
//           value = JSON.parse(value);
//         } catch {
//           // keep as provided string
//         }
//       }

//       session.leadData[currentField] = value;

//       // Move to next *missing* field (skip already-filled ones)
//       session.step++;
//       advanceStep(session);

//       // If we were fixing a duplicate and need to return to confirmation
//       if (session.resumeToConfirmation && session.step >= allFields.length) {
//         session.resumeToConfirmation = false;
//         const summary = buildSummary(session.leadData);
//         aiResponse = `Here are the updated details:\n${summary}\n\nWould you like to confirm this lead? (Yes/No)`;
//         return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: true });
//       }
//     }

//     // ---- Ask next field ----
//     if (session.step < allFields.length) {
//       const nextField = allFields[session.step];
//       aiResponse = `Please provide ${nextField.replace("_", " ")} (example: ${fieldExamples[nextField]})`;
//       if (enumMappings[nextField]) {
//         aiResponse += ` | Options: ${enumMappings[nextField].join(", ")}`;
//       }
//       if (!mandatoryFields.includes(nextField)) {
//         aiResponse += `. Type "skip" to leave it blank.`;
//       }
//       return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: false });
//     }

//     // If we somehow reach here and everything is filled, show confirmation
//     const summary = buildSummary(session.leadData);
//     aiResponse = `Here are the details I have:\n${summary}\n\nWould you like to confirm this lead? (Yes/No)`;
//     return res.json({ aiResponse, leadData: session.leadData, awaitingConfirmation: true });

//   } catch (err) {
//     console.error("AI Assistant Error:", err);
//     res.status(500).json({ error: "Something went wrong in AI assistant." });
//   }
// });

// module.exports = router;
