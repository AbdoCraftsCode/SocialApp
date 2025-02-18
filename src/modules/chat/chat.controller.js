import { Router } from "express";
import { findonechat } from "./service/chat.service.js";
import { authentication } from "../../middlewere/authintcatoin.middlewhere.js";
const router = Router();

router.get("/findonechat/:destId", authentication(), findonechat)

export default router;
