import mongoose, { Schema, Types, model } from 'mongoose';

const RankSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',  // ربط الترتيب بالمستخدم
        required: true,
    },
    score: {
        type: Number,  // الدرجات
        required: true,
    },
    rank: {
        type: Number,  // الترتيب بناءً على الدرجات
        required: true,
    }
}, { timestamps: true });

const RankModel = mongoose.models.Rank || model('Rank', RankSchema);

export default RankModel;
