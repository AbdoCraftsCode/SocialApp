import { Router } from "express";
import  {  addQuestion, classs, deleteQuestion, getUserRank, subjectcreate, updateAndGetRanks, updateQuestion } from "../questions/service/question.service.js"
import { authentication } from "../../middlewere/authintcatoin.middlewhere.js";

const router = Router()

router.patch("/updateQuestion/:questionId", updateQuestion)
router.get("/rank",updateAndGetRanks)
router.get("/getUserRank/:userId", getUserRank)
router.post("/classcreate",classs)
router.post("/subject", subjectcreate)
router.post("/addQuestion", addQuestion)
router.delete("/deleteQuestion/:questionId", deleteQuestion)


export default router