const supabase = require('../db/supabaseClient');

// Add a new lead
exports.addLead = async (req, res) => {
    const {
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        status,
        source,
        type,
        notes,
        property_type,
        budget_range,
        preferred_location,
        bedrooms,
        bathrooms,
        timeline,
        social_media
    } = req.body;

    console.log(req.body);
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([{
                user_id,
                first_name,
                last_name,
                email,
                phone_number,
                status,
                source,
                type,
                notes,
                property_type,
                budget_range,
                preferred_location,
                bedrooms,
                bathrooms,
                timeline,
                social_media
            }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Lead added successfully.', lead: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};