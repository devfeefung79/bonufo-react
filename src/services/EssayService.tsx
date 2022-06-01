import axios from 'axios';
import { EssayModel, MarkingSchemeModel } from '../utils/EssayUtils';

export let getEssayByEssayId = async (essayId: string): Promise<EssayModel | undefined> => {
  const data = await axios.get(`/essay/${essayId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let getEssayListByQuestionId = async (questionId: string): Promise<Array<EssayModel> | undefined> => {
  const data = await axios.get(`/essay/by-question/${questionId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let getMarkingSchemeList = async (): Promise<Array<MarkingSchemeModel> | undefined> => {
  const data = await axios.get(`/essay/marking-scheme`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};