import { connectDB } from "./DB/connection.js"
import { globalerror } from "./utlis/response/error.response.js"
import authcontroller from "./modules/auth/auth.controller.js"
import usercontroller from "./modules/user/user.controller.js"
import questioncontroller from "./modules/questions/question.controller.js"
import chatcontroller from "./modules/chat/chat.controller.js"
import path from "node:path"
import cors from 'cors';

export const bootstap = (app, express) => {
    app.use(express.json());

 
    app.use(cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization"
    }));

    connectDB();

    app.use("/auth", authcontroller);
    app.use("/user", usercontroller);
    app.use("/question", questioncontroller);
    app.use("/chat", chatcontroller);
    app.use("/uploads", express.static(path.resolve("uploads")));
    app.use(globalerror);
};

export default bootstap;
