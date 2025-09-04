const supabase = require('../db/supabaseClient');

// Add a new lead
exports.addLead = async (req, res) => {
    const {
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
                user_id: req.user.userId,
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

// Get all leads
exports.getAllLeads = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*');

        if (error) {
            throw error;
        }

        res.status(200).json({ leads: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single lead by ID
exports.getLeadById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ message: 'Lead not found.' });
        }

        res.status(200).json({ lead: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all leads with pagination, filtering, and search
exports.getAllLeads = async (req, res) => {
  const { page = 1, limit = 10, status, source, search } = req.query;
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  const start = (parsedPage - 1) * parsedLimit;
  const end = start + parsedLimit - 1;

  try {
    let query = supabase.from('leads').select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('source', source);
    }

    // Search across first_name and last_name
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    // Pagination
    query = query.range(start, end);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    res.status(200).json({
      leads: data,
      totalLeads: count,
      currentPage: parsedPage,
      totalPages: Math.ceil(count / parsedLimit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get leads based on status or source (no pagination)
exports.getFilteredLeads = async (req, res) => {
    const { status, source } = req.query;

    try {
        let query = supabase.from('leads').select('*');

        // Conditionally apply filters
        if (status) {
            query = query.eq('status', status);
        }
        if (source) {
            query = query.eq('source', source);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        res.status(200).json({ leads: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a single lead by ID
exports.getLeadById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ message: 'Lead not found.' });
        }

        res.status(200).json({ lead: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
