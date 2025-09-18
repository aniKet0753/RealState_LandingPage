const supabase = require("../db/supabaseClient");

const checkDuplicatePhone = async (req, res, next) => {
  try {
    const phone = req.body.phone_number;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("id")
      .eq("phone_number", phone)
      .limit(1);

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (data && data.length > 0) {
      
      return res.status(409).json({ message: "Phone number already exists" });
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkDuplicatePhone;
