export interface IGeneratedQuestion {
    id: string
    type: string
    question: string
    options: {option: string, is_correct: boolean}[]
    expected_answer: string
    mark: number

  }

