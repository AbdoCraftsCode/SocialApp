import mongoose, { Schema, Types,model } from "mongoose";

const QuestionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,  // عنوان السؤال
        },
        answers: {
            type: [String],  // قائمة من الإجابات المحتملة
            required: true,
        },
        correctAnswer: {
            type: String,  // الإجابة الصحيحة
            required: true,
        },
        mark: {
            type: Number,  // الدرجة
            required: true,
        },

        subjectId: {
                    
                    type: Types.ObjectId,
                    ref:"Subject"
        },
        userId: {

            type: Types.ObjectId,
            ref: "User"
        },
         classId: {

            type: Types.ObjectId,
            ref: "Class"
        }
        


    },
    { timestamps: true }  // إضافة طابع زمني لتسجيل مواعيد الإضافة والتعديل
);

const QuestionModel = mongoose.models.Question || model("Question", QuestionSchema);

export default QuestionModel;
