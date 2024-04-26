import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: String,
    questioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, { timestamps: true })

const questionModel = mongoose.models.question || new mongoose.model('question', questionSchema)

export default questionModel