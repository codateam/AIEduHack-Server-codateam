import * as express from "express";
import authRoutes from "../../../core/modules/auth/auth.router";
import orgRoutes from "../../modules/org/org.routes";
import courseRoutes from "../../modules/course/course.routes";
import enrollmentRoutes from "../../modules/enrollment/enrollment.routes";
import examRoutes from "../../modules/exam/exam.routes";
import questionRoutes from "../../modules/exam/question.routes";
import answerRoutes from "../../modules/exam/answer.routes";
import aiRoutes from "../../modules/ai/ai.routes"


const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to server!" });
});

router.use("/auth", authRoutes);
router.use("/organizations", orgRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/exams", examRoutes);
router.use("/questions", questionRoutes);
router.use("/answers", answerRoutes);
router.use("/ai", aiRoutes)

export default router;
