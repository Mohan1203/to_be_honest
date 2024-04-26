import mongoose from 'mongoose'

const asnwerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    },
    answer: {
        type: String,
        require: ['true', "Answer is must"]
    },
    answerer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const answerModel = mongoose.models.answer || new mongoose.model('answer', asnwerSchema)

export default answerModel;