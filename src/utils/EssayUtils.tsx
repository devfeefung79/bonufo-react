export interface EssayModel {
  _id: string;
  questionId: string;
  question: string;
  submittedId: string;
  submitterName: string;
  submittedDateTime?: Date;
  markingSchemeId: string;
  markingSchemeName: string;
  state: string;
  content: string;
  wordCount: number;
  attachment?: Buffer;
  numberOfFeedbacks: number;
  averageScore?: number;
}

export const defaultEssayModel: EssayModel = {
  _id: '',
  questionId: '',
  question: '',
  submittedId: '',
  submitterName: '',
  markingSchemeId: '',
  markingSchemeName: '',
  state: '',
  content: '',
  wordCount: 0,
  numberOfFeedbacks: 0,
}

export interface MarkingSchemeSectionModel {
  sequence: number;
  description: string;
  supplementaryText: string;
  weighting: number;
  fullScore: number;
}

export interface MarkingSchemeModel {
  _id: string;
  name: string;
  minWords?: number;
  maxWords?: number;
  relatedExam: Array<any>;
  sections?: Array<MarkingSchemeSectionModel>;
  state: string;
  calculationMode: string;
  totalFullScore: number;
}

export const defaultMarkingSchemeModel: MarkingSchemeModel = {
  _id: '',
  name: '',
  minWords: 0,
  maxWords: 0,
  relatedExam: [],
  sections: [],
  state: '',
  calculationMode: '',
  totalFullScore: 0,
}

export interface AddEssayRequestBody {
  questionId: string;
  question: string;
  submitterId: string;
  submitterName: string;
  markingSchemeId: string;
  markingSchemeName: string;
  state: string;
  content: string;
  wordCount: number;
}