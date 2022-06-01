import axios from 'axios';
import { EssayModel } from '../utils/EssayUtils';

export let getFeedbackByFeedbackId = (feedbackId: string): EssayModel | void => {
  axios.get(`/feedback/${feedbackId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
};

export let getFeedbackListByEssayId = (essayId: string): Array<EssayModel> | void => {
  axios.get(`/feedback/by-essay/${essayId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
};


export let getFeedbackListByUserId = (userId: string): Array<EssayModel> | void => {
  axios.get(`/feedback/by-user/${userId}`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
};