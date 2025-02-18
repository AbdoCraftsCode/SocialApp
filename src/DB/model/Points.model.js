import mongoose, { Schema, Types, model } from 'mongoose';

const PointsSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User', // ربط النقاط بالمستخدم
        required: true,
    },
  score: {
        type: Number,
        required: true, // النقاط التي حصل عليها المستخدم
    },
}, { timestamps: true });

const PointsModel = mongoose.models.Points || model('Points', PointsSchema);

export default PointsModel;
