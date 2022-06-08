import { useState, useEffect } from 'react';
import { EssayModel } from '../../utils/EssayUtils';
import { getEssayListByUserId } from '../../services/EssayService';
import { FeedbackModel } from '../../utils/FeedbackUtils';
import { getFeedbackListByUserId } from '../../services/FeedbackService';
import { SavedQuestionModel } from '../../utils/QuestionUtils';
import { getSavedQuestionListByUserId, deleteSavedQuestion } from '../../services/QuestionService';
import { Image, Button } from 'semantic-ui-react'
import './Profile.css';
//import EditSummary from './summary/EditSummary';
import SavedQuestion from './saved-question/SavedQuestion';
import SubmissionHistory from './submission-history/SubmissionHistory';
import FeedbackHistory from './feedback-history/FeedbackHistory';

function Profile(props) {

  const [pageControl, setPageControl] = useState({
    isAccordionActiveList: [],
    isShowSummaryModel: false,
    isLoadingSavedQuestion: false,
    isLoadingSubmissionList: false,
    isLoadingFeedbackList: false,
  });
  const [savedQuestions, setSavedQuestions] = useState<Array<SavedQuestionModel>>([]);
  const [submissionList, setSubmissionList] = useState<Array<EssayModel>>([]);
  const [feedbackList, setFeedbackList] = useState<Array<FeedbackModel>>([]);

  useEffect(() => {
    getSavedQuestion(props.user._id, props.user.accessToken);
    switch (props.user.role.toUpperCase()) {
      case 'LEARNER':
        getSubmissionList(props.user._id, props.user.accessToken);
        break;
      case 'TUTOR':
        getfeedbackList(props.user._id, props.user.accessToken);
        break;
    }
  }, [props.user._id, props.user.role, props.user.accessToken]);

  const getSubmissionList = async (userId: string, accessToken: string) => {
    const submissionList = await getEssayListByUserId(userId, accessToken);
    if (submissionList) setSubmissionList(submissionList);
  }

  const getfeedbackList = async (userId: string, accessToken: string) => {
    const feedbackList = await getFeedbackListByUserId(userId, accessToken);
    if (feedbackList) setFeedbackList(feedbackList);
  }

  const getSavedQuestion = async (userId: string, accessToken: string) => {
    const savedQuestionList = await getSavedQuestionListByUserId(userId, accessToken);
    if (savedQuestionList) setSavedQuestions(savedQuestionList);
  }

  const unsaveQuestion = async (userId: string, questionId: string, accessToken: string) => {
    await deleteSavedQuestion(userId, questionId, accessToken);
    getSavedQuestion(userId, accessToken);
  }

  const handleOpenModal = () => {
    setPageControl({ ...pageControl, isShowSummaryModel: true })
  };

  const handleCloseModal = () => {
    setPageControl({ ...pageControl, isShowSummaryModel: false })
  }

  const handleLogout = () => {
    props.handleLogout();
  }

  const handleAccordionActiveList = (index) => {
    let newActiveList = pageControl.isAccordionActiveList;
    let foundIndex = newActiveList.findIndex((elem) => elem === index);
    if (foundIndex !== -1) {
      newActiveList.splice(foundIndex, 1);
    }
    else {
      newActiveList.push(index);
    }
    setPageControl({ ...pageControl, isAccordionActiveList: newActiveList })
  }

  return (
    <>
      {/*
      <EditSummary
        userId={props.user._id}
        summary={props.user.summary}
        isShow={pageControl.isShowSummaryModel}
        handleCloseModal={() => handleCloseModal()} />
      */}
      <div>
        <div className='logout-btn-box'>
          <Button
            className='logout-btn'
            type='submit'
            onClick={() => handleLogout()}>
            Logout
          </Button>
          <br />
        </div>
        <span className='profile-heading-text'>
          {props.user && props.user.role ? `${props.user.role} Profile` : null}
        </span>
        <div className="user-info">
          {props.user.picture ?
            <Image
              className="profile-user-image"
              src={`https://images.unsplash.com/photo-1561127954-65393e6644d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=478&q=80`}
              size='small'
              avatar />
            :
            <div className="profile-user-icon">
              <span>{props.user.username && props.user.username.toUpperCase().charAt(0)}</span>
            </div>
          }
          <span className='profile-username-text'>
            {props.user && props.user.username ? props.user.username : null}
          </span>
          {/*props.user && props.user.summary ?
            <>
              <p>{props.user.summary}</p>
              <i className="pencil alternate icon"></i>
            </>
            :
            <>
              <p onClick={() => handleOpenModal()}>
                Add a summary text to let people know more about you.
              </p>
        </>*/}
        </div>
        <SavedQuestion
          isLoading={pageControl.isLoadingSavedQuestion}
          userId={props.user._id}
          savedQuestions={savedQuestions}
          unsaveQuestion={(userId, questionId) => unsaveQuestion(userId, questionId, props.user.accessToken)}
        />
        {props && props.user && props.user.role === 'Learner' ?
          <SubmissionHistory
            isLoading={pageControl.isLoadingSubmissionList}
            submissionList={submissionList}
            isAccordionActiveList={pageControl.isAccordionActiveList}
            handleAccordionActiveList={(index) => handleAccordionActiveList(index)}
          />
          :
          <FeedbackHistory
            isLoading={pageControl.isLoadingFeedbackList}
            feedbackList={feedbackList}
            isAccordionActiveList={pageControl.isAccordionActiveList}
            handleAccordionActiveList={(index) => handleAccordionActiveList(index)}
          />
        }

      </div >
    </>
  );
}

export default Profile;
