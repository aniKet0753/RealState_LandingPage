require("dotenv").config();
const express = require('express');
const agentRoutes = require('./routes/agentRoutes');
const leadRoutes = require('./routes/leadRoutes');
const retailAIRoutes = require('./routes/retailAIWebhook'); // triggers Retail AI call
const retailAITriggerRoutes = require("./routes/retailAITriggerRoutes");
const uploadRoute = require("./routes/workglow");
const landingPageRoutes = require('./routes/landingpage');


const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Routes
// app.use('/api/agents', agentRoutes);
// app.use("/api", uploadRoute);
app.use('/api/landing-pages', landingPageRoutes);
// app.use('/api/leads', leadRoutes);
// app.use('/api/otp', require('./routes/otpRoutes'));
// app.use('/api/ai-assistant', require('./routes/aiLeads'));
// app.use('/api/ai-assistant', require('./routes/aiAssistant'));
// app.use('/api/retailai', retailAITriggerRoutes); //

app.get('/', (req, res) => {
    res.send('AgentSuit Backend API is working!');
});
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});