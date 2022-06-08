import { MarkingSchemeSectionModel } from './EssayUtils';

interface FeedbackSectionModel extends MarkingSchemeSectionModel {
  score?: number;
  comment?: string;
}

export interface FeedbackModel {
  _id: string;
  essayId: string;
  essay: string;
  submitterId: string;
  submitterName: string;
  submitterDateTime?: Date;
  sections?: Array<FeedbackSectionModel>;
  overallComment?: string;
  totalScore: number;
}

export const defaultFeedbackModel: FeedbackModel = {
  _id: '',
  essayId: '',
  essay: '',
  submitterId: '',
  submitterName: '',
  sections: [],
  overallComment: '',
  totalScore: 0,
}

export interface AddFeedbackRequestBody {
  essayId: string;
  essay: string;
  submitterId: string;
  submitterName: string;
  sections?: Array<FeedbackSectionModel>;
  overallComment?: string;
  totalScore: number;
}