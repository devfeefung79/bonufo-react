export interface QuestionTagModel {
  _id: string;
  label: string;
}

export interface QuestionModel {
  _id: string;
  topic?: Array<string>;
  questionType?: Array<string>;
  relatedExam?: Array<string>;
  question: string;
}

export const defaultQuestionModel: QuestionModel = {
  _id: '',
  topic: [],
  questionType: [],
  relatedExam: [],
  question: '',
}

export interface SavedQuestionModel {
  _id: string;
  userId: string;
  questionId: string;
  question: string;
}

export const defaultSavedQuestionModel: SavedQuestionModel = {
  _id: '',
  userId: '',
  questionId: '',
  question: '',
}