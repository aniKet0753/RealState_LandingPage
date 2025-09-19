const express = require('express');
const agentRoutes = require('./routes/agentRoutes');
const leadRoutes = require('./routes/leadRoutes');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5002;


app.use(express.json());
app.use(cors());
// Routes
app.use('/api/agents', agentRoutes);

app.use('/api/leads', leadRoutes);
app.use('/api/otp', require('./routes/otpRoutes'));
// app.use('/api/ai-assistant', require('./routes/aiLeads'));
app.use('/api/ai-assistant', require('./routes/aiAssistant'));

app.get('/', (req, res) => {
    res.send('AgentSuit Backend API is working!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});