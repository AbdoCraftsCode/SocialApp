import { asyncHandelr } from "../../../utlis/response/error.response.js";
import * as dbservice from "../../../DB/dbservice.js";
import { successresponse } from "../../../utlis/response/sucsess.response.js";
import Classmodel from "../../../DB/model/Class.model.js";
import Subjectmodel from "../../../DB/model/Subject.model.js";
import QuestionModel from "../../../DB/model/Question.model.js";
import ExamModel from "../../../DB/model/rank.model.js";
import RankModel from "../../../DB/model/rank.model.js";
import PointsModel from "../../../DB/model/Points.model.js";
import AnswerRecordModel from "../../../DB/model/correctQuestion.model.js";

export const classs = asyncHandelr(async (req, res, next) => {

    const { Name } = req.body;


    if (!Name) {
        return next(new Error("اسم الصف مطلوب", { cause: 400 }));
    }


    const user = await dbservice.create({
        model: Classmodel,
        data: {
            Name
        }
    });

    return successresponse(res, "Class created successfully", 201, { user });
}
);

export const subjectcreate = asyncHandelr(async (req, res, next) => {

    const { Name, classId } = req.body;




    const user = await dbservice.create({
        model: Subjectmodel,
        data: {
            Name,
            classId,
        }
    });

    return successresponse(res, "Class created successfully", 201, { user });
}
);








export const addQuestion = asyncHandelr(async (req, res, next) => {
    const { title, answers, correctAnswer, mark, subjectId, userId, classId, userAnswer } = req.body;

    let question;

    question = await QuestionModel.findOne({ title, correctAnswer });


    if (!question) {
        question = new QuestionModel({
            title,
            answers,
            correctAnswer,
            mark,
            subjectId,
            userId,
            classId
        });
        await question.save();
    }


    const isCorrect = question.correctAnswer === userAnswer;
    if (!isCorrect) {
        return res.status(200).json({ success: false, message: "إجابة خاطئة" });
    }


    const existingRecord = await AnswerRecordModel.findOne({ userId, questionId: question._id });
    if (existingRecord) {
        return res.status(200).json({
            success: true,
            message: "لقد أجبت عن هذا السؤال بشكل صحيح من قبل، لن يتم إضافة نقاط إضافية"
        });
    }


    let userPoints = await PointsModel.findOne({ userId });
    if (!userPoints) {
        userPoints = new PointsModel({ userId, score: mark });
    } else {
        userPoints.score += mark;
    }
    await userPoints.save();

    const newAnswerRecord = new AnswerRecordModel({
        userId,
        questionId: question._id
    });
    await newAnswerRecord.save();

    const newScore = userPoints.score;

    const higherCount = await PointsModel.countDocuments({ score: { $gt: newScore } });
    const newRankValue = higherCount + 1;

    let userRank = await RankModel.findOne({ userId });
    if (!userRank) {
        userRank = new RankModel({ userId, score: newScore, rank: newRankValue });
    } else {
        userRank.score = newScore;
        userRank.rank = newRankValue;
    }
    await userRank.save();

    res.status(200).json({
        success: true,
        message: `إجابة صحيحة! تم إضافة ${mark} درجة 🎉`,
        totalScore: userPoints.score
    });
});








export const updateAndGetRanks = asyncHandelr(async (req, res) => {


    const students = await PointsModel.find().sort({ score: -1 });
    console.log("عدد الطلاب:", students.length);

    if (students.length === 0) {
        return res.status(200).json({ success: false, message: "لا يوجد طلاب بعد" });
    }

    let updatedRanks = [];

    for (let i = 0; i < students.length; i++) {
        const userId = students[i].userId;
        const score = students[i].score;
        const rank = i + 1;



        let userRank = await RankModel.findOne({ userId });
        if (!userRank) {
            userRank = new RankModel({ userId, score, rank });

        } else {
            userRank.score = score;
            userRank.rank = rank;

        }

        await userRank.save();

        updatedRanks.push(userRank);
    }

    res.status(200).json({ success: true, message: "تم تحديث الترتيب بنجاح", ranks: updatedRanks });

})














export const getUserRank = asyncHandelr(async (req, res) => {

    const { userId } = req.params;


    const userRank = await RankModel.findOne({ userId }).populate("userId", "username email userId");

    if (!userRank) {
        return res.status(404).json({ success: false, message: "المستخدم غير موجود في الترتيب" });
    }

    res.status(200).json({
        success: true,
        message: "تم جلب بيانات المستخدم مع ترتيبه بنجاح",
        user: {


            username: userRank.userId.username,
            userId: userRank.userId.userId,
            score: userRank.score,
            rank: userRank.rank
        }
    });

})



export const deleteQuestion = asyncHandelr(async (req, res, next) => {

    const { questionId } = req.params;



    const question = await QuestionModel.findByIdAndDelete(questionId);


    if (!question) {
        return res.status(404).json({
            success: false,
            message: "السؤال غير موجود"
        });
    }


    // إرسال استجابة بنجاح
    res.status(200).json({
        success: true,
        message: "تم حذف السؤال بنجاح"
    });


});


export const updateQuestion = asyncHandelr(async (req, res, next) => {

    const { questionId } = req.params;

    const { title,
        classId,
        answers,
        correctAnswer,
        mark,
        subjectId,

    } = req.body



    const question = await dbservice.findOneAndUpdate({

        model: QuestionModel,
        filter: {

            _id: questionId
        },
        data: {

            title,
            answers,
            correctAnswer,
            mark,
            subjectId,

            classId
        },
        options: {

            new: true
        }

    })


    if (!question) {
        return res.status(404).json({
            success: false,
            message: "السؤال غير موجود"
        });
    }



    res.status(200).json({
        success: true,
        message: "تم   تحديث السؤال بنجاح"
    });


});






