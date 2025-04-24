const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number, 
        required: true,
        min: 1,
        max: 5,
    }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
