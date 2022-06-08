import { axiosPrivate } from '../utils/ServiceUtils';
import { EssayModel, MarkingSchemeModel, AddEssayRequestBody } from '../utils/EssayUtils';

export const getEssayByEssayId = async (essayId: string, accessToken: string): Promise<EssayModel | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/essay/${essayId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getEssayListByQuestionId = async (questionId: string, accessToken: string): Promise<Array<EssayModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/essay/by-question/${questionId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getEssayListByUserId = async (userId: string, accessToken: string): Promise<Array<EssayModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/essay/by-user/${userId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};


export const getMarkingSchemeById = async (markingSchemeId: string, accessToken: string): Promise<MarkingSchemeModel | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/essay/marking-scheme/${markingSchemeId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getMarkingSchemeList = async (accessToken: string): Promise<Array<MarkingSchemeModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/essay/marking-scheme/all`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const addEssay = async (AddFeedbackRequestBody: AddEssayRequestBody, accessToken: string): Promise<EssayModel | undefined> => {
  const data = await axiosPrivate(accessToken).post(`/essay/add`, AddFeedbackRequestBody)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};
