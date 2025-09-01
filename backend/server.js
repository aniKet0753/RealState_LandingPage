const express = require('express');
const agentRoutes = require('./routes/agentRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
    res.send('AgentSuit Backend API is working!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});