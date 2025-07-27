import { IGeneratedQuestion } from "../../types/question";

interface IQuestion {
      exam: string;
      type: "mcq" | "theory" | "german";
      text: string;
      options?: string[];
      correctAnswer?: string;
      mark: number;
}
export const formatQuestion = (questions: IGeneratedQuestion[], examId:string): IQuestion[] => {
const validTypes: {[key: string]:"mcq"| "theory"| "german"} = {mcq: "mcq", essay:"theory", "fill-in-the-blank":"german"};

return questions.map((question) => ({
      exam:examId,
      type: validTypes[question.type] || "mcq",
      text: question.question,
      options: question?.options && question.options ? question.options.map(item=> item.option) : [],
        expected_answer: question?.expected_answer || "",
      correctAnswer: question?.expected_answer || "",
      mark: question?.mark || 1,
}))
}