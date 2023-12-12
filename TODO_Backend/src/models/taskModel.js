const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    category: String,
    isCompleted: Boolean,
    addDate: Date,
    dueDate: Date
});

module.exports = mongoose.model('Tasks', taskSchema);