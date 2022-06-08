import { axiosPrivate } from '../utils/ServiceUtils';
import { FeedbackModel, AddFeedbackRequestBody } from '../utils/FeedbackUtils';

export const getFeedbackByFeedbackId = async (feedbackId: string, accessToken: string): Promise<FeedbackModel | void> => {
  const data = await axiosPrivate(accessToken).get(`/feedback/${feedbackId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getFeedbackListByEssayId = async (essayId: string, accessToken: string): Promise<Array<FeedbackModel> | void> => {
  const data = await axiosPrivate(accessToken).get(`/feedback/by-essay/${essayId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const getFeedbackListByUserId = async (userId: string, accessToken: string): Promise<Array<FeedbackModel> | void> => {
  const data = await axiosPrivate(accessToken).get(`/feedback/by-user/${userId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const addFeedback = async (requestBody: AddFeedbackRequestBody, accessToken: string): Promise<FeedbackModel | void> => {
  const data = await axiosPrivate(accessToken).post(`/feedback/add`, requestBody)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};