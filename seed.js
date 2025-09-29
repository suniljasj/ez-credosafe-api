require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Loan = require('./models/loan');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');

        const user = new User({ name: 'John Doe', email: 'john@example.com', phone: '9999999999' });
        await user.save();

        const loan = new Loan({ userId: user._id, amount: 50000, interestRate: 12, tenureMonths: 12 });
        await loan.save();

        console.log('Test data seeded');
        process.exit();
    })
    .catch(err => console.log(err));
