require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reminders', reminderRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
