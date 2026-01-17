const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

const taskSchema = new mongoose.Schema({
    _id: { type: Number },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [200, 'Title must be less than 200 characters']
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'done'],
        default: 'pending'
    },
    assigned_to_id: {
        type: Number,
        ref: 'User',
        required: false
    },
    created_by_id: {
        type: Number,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    _id: false,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

taskSchema.pre('save', async function () {
    if (this.isNew) {
        this._id = await getNextSequence('tasks');
    }
});

taskSchema.virtual('assignee', {
    ref: 'User',
    localField: 'assigned_to_id',
    foreignField: '_id',
    justOne: true
});

taskSchema.virtual('creator', {
    ref: 'User',
    localField: 'created_by_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Task', taskSchema);
