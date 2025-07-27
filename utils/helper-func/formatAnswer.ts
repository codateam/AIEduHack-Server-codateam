import { Types } from 'mongoose';
import { IAnswer, IQuestion } from '../../core/modules/exam/exam.model';
import { AIRequestBody } from '../../core/modules/ai/ai.services';


interface AIGradingRequest extends AIRequestBody {
  id: string;
  question: string;
  course_id: string;
  expected_answer: string;
  student_answer: string;
  type: "mcq" | "essay" | "fill-in-the-blank";
  points: number;
  selected_answer?: string;
}

export const formatAnswerForAIGrading = (
  questions: (IQuestion & { _id: Types.ObjectId })[],
  answers: (IAnswer & { _id: Types.ObjectId })[],
  courseId: string
): AIRequestBody[] => {

  return questions.map(question => {
    const answer = answers.find(a => a.question.toString() === question._id.toString());
    const validTypes: {[key: string]:"mcq"| "essay"| "fill-in-the-blank"} = {mcq: "mcq", theory:"essay", german:"fill-in-the-blank"};

    return {
      id: question._id.toString(),
      question: question.text,
      course_id: courseId,
      expected_answer: question.correctAnswer || "",
      student_answer: answer?.writtenAnswer || "",
      type: validTypes[question.type],
      points: question.mark,
    };
  });
};