const Feedback = require('../models/feedback');

const createFeedback = async (req, res) => {
    const type = req.body.type;
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const rating = req.body.rating;

    const feedback = new Feedback({
        type,
        name,
        email,
        subject,
        message,
        rating
    });

    feedback.save()
        .then(() => {
            res.json("Feedback Entered Successfully");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Feedback Entered failed" });
        });
};

module.exports = { createFeedback };
