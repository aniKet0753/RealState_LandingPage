// const supabase = require("../db/supabaseClient");

// const checkDuplicateEmail = async (req, res, next) => {
//   try {
//     const email = req.body.email?.toLowerCase();
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const { data, error } = await supabase
//       .from("leads")
//       .select("id")
//       .eq("email", email)
//       .limit(1);

//     if (error) {
//       console.error("Supabase query error:", error);
//       return res.status(500).json({ message: "Server error" });
//     }

//     if (data && data.length > 0) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     next();
//   } catch (err) {
//     console.error("Middleware error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = checkDuplicateEmail;
