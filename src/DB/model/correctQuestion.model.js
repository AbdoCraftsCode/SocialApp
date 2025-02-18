// models/AnswerRecord.js
import mongoose, { Schema, model } from 'mongoose';

const AnswerRecordSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }
}, { timestamps: true });

const AnswerRecordModel = mongoose.models.AnswerRecord || model('AnswerRecord', AnswerRecordSchema);

export default AnswerRecordModel;
