import { AxiosResponse } from 'axios';
import { axiosPrivate } from '../utils/ServiceUtils';
import { SearchFormRequestBody } from '../utils/FormUtils';
import { QuestionModel, QuestionTagModel, SavedQuestionModel } from '../utils/QuestionUtils';

/* Question */

export const getQuestionById = async (id: string, accessToken: string): Promise<QuestionModel | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/question/${id}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};


export const getQuestionList = async (accessToken: string): Promise<Array<QuestionModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/question/all`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getQuestionListByFilter = async (requestBody: SearchFormRequestBody, accessToken: string): Promise<Array<QuestionModel> | undefined> => {
  const data = await axiosPrivate(accessToken).post(`/question/search`, requestBody)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

/* Question Tag Dropdown List */

export const getTopicList = async (accessToken: string): Promise<Array<QuestionTagModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/question/topics`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getQuestionTypeList = async (accessToken: string): Promise<Array<QuestionTagModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/question/question-types`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getExamList = async (accessToken: string): Promise<Array<QuestionTagModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/question/exams`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

/* Saved Question */

export const getSavedQuestionListByUserId = async (userId: string, accessToken: string): Promise<Array<SavedQuestionModel> | undefined> => {
  const data = await axiosPrivate(accessToken).get(`/question/saved-questions/${userId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const addSavedQuestion = async (savedQuestionData: { userId: string, questionId: string, question: string }, accessToken): Promise<SavedQuestionModel | undefined> => {
  const data = await axiosPrivate(accessToken).post(`/question/save`, savedQuestionData)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const deleteSavedQuestion = async (userId: string, questionId: string, accessToken): Promise<AxiosResponse | undefined> => {
  const data = await axiosPrivate(accessToken).delete(`/question/unsave/${userId}/${questionId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};
