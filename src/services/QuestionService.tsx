import axios, { AxiosResponse } from 'axios';
import { SearchFormRequestBody } from '../utils/FormUtils';
import { QuestionModel, QuestionTagModel, SavedQuestionModel } from '../utils/QuestionUtils';

const BASE_URL = `https://bonufo-express.vercel.app`;

/* Question */

export let getQuestionList = async (accessToken): Promise<Array<QuestionModel> | undefined> => {
  const data = await axios.get(`${BASE_URL}/question/all`, {
    headers: {
      "access-control-allow-origin": "*",
      "Authorization": `Bearer ${accessToken}`
    }
  })
    .then(res => {
      return res.data;;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let getQuestionListByFilter = async (requestBody: SearchFormRequestBody, accessToken): Promise<Array<QuestionModel> | undefined> => {
  const data = await axios.post(`${BASE_URL}/question/search`, requestBody, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

/* Question Tag Dropdown List */

export let getTopicList = async (accessToken): Promise<Array<QuestionTagModel> | undefined> => {
  const data = await axios.get(`${BASE_URL}/question/topics`, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let getQuestionTypeList = async (accessToken): Promise<Array<QuestionTagModel> | undefined> => {
  const data = await axios.get(`${BASE_URL}/question/question-types`, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let getExamList = async (accessToken): Promise<Array<QuestionTagModel> | undefined> => {
  const data = await axios.get(`${BASE_URL}/question/exams`, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

/* Saved Question */

export let getSavedQuestionListByUserId = async (userId: string, accessToken): Promise<Array<SavedQuestionModel> | undefined> => {
  const data = await axios.get(`${BASE_URL}/question/saved-questions/${userId}`, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let addSavedQuestion = async (savedQuestionData: { userId: string, questionId: string, question: string }, accessToken): Promise<SavedQuestionModel | undefined> => {
  const data = await axios.post(`${BASE_URL}/question/save`, savedQuestionData, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export let deleteSavedQuestion = async (savedQuestionData: { userId: string, questionId: string }, accessToken): Promise<AxiosResponse | undefined> => {
  const data = await axios.delete(`/question/unsave/${savedQuestionData.userId}/${savedQuestionData.questionId}`, {
    headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` }
  })
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};
