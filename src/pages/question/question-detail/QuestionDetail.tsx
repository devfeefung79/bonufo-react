import { useState, useEffect } from 'react';
import axios from 'axios';
import { QuestionModel } from '../../../utils/QuestionUtils';
import { Link, useParams } from "react-router-dom";
import { Segment, Divider, Button, Label, Placeholder, Image } from 'semantic-ui-react';
import EmptyListIcon from '../../../assets/bear-5846065_960_720.jpg';
import './QuestionDetail.css';

const BASE_URL = `https://bonufo-express.vercel.app/`;

function QuestionDetail(props) {

  let { questionId } = useParams<{ questionId: string }>();
  let [currentQuestion, setCurrentQuestion] = useState<QuestionModel>();
  let [submissionList, setSubmissionList] = useState([]);
  let [pageControl, setPageControl] = useState({
    isLoadingQuestion: false,
    isLoadingSubmission: false,
  })

  useEffect(() => {
    getcurrentQuestion(questionId);
    getSubmissionList();
  }, []);

  let getcurrentQuestion = async (id: string) => {
    await setPageControl({ ...pageControl, isLoadingQuestion: true });
    axios.get(`${BASE_URL}/question/${id}`, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        setCurrentQuestion(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setPageControl({ ...pageControl, isLoadingQuestion: false });
      })
  };

  let getSubmissionList = async () => {
    await setPageControl({ ...pageControl, isLoadingSubmission: true });
    axios.get(`${BASE_URL}/essay/by-question/${questionId}`, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        setSubmissionList(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setPageControl({ ...pageControl, isLoadingSubmission: false });
      })
  }

  return (
    <div>
      {props && props.user && props.user.role === 'Learner' ?
        <div className='write-essay-button-box'>
          <Link to={`/question/${questionId}/write-essay`}>
            <Button
              className='write-essay-button'>
              Write an essay
            </Button>
          </Link>
        </div>
        : null}
      <span className='question-heading-text'>
        View Question
      </span>
      <div className='question-detail-box'>
        {pageControl.isLoadingQuestion ?
          <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder> :
          <>{currentQuestion ?
            <div>
              {currentQuestion.topic ? currentQuestion.topic.map((tItem) =>
                <Label className='topic-label' key={tItem}>
                  {tItem}
                </Label>
              ) : null}
              {currentQuestion.questionType ? currentQuestion.questionType.map((pItem) =>
                <Label className='question-type-label' key={pItem}>
                  {pItem}
                </Label>
              ) : null}
              {currentQuestion.relatedExam ? currentQuestion.relatedExam.map((eItem) =>
                <Label className='exam-label' key={eItem}>
                  {eItem}
                </Label>
              ) : null}
              <p className='question-content-text'>
                {currentQuestion.question}
              </p>
            </div>
            : null}
          </>
        }
      </div>
      <>
        {!pageControl.isLoadingSubmission && submissionList && submissionList.length !== 0 ?
          <Segment loading={pageControl.isLoadingSubmission}>
            <span className='result-count'>
              {submissionList && submissionList.length} Result(s)
            </span>
            <span className='prev-submission-text'>
              Previous Submission
            </span>
            {submissionList.map((sItem, index) =>
              <div>
                <Divider />
                <Link to={`/submission/${sItem._id}`}>
                  <span className='submitter-name-text'>
                    Submitted by {sItem.submitterName}
                  </span>
                  <span className='average-score-text'>
                    Average Score: {sItem.numberOfFeedbacks === 0 ? 'N/A' : `${sItem.averageScore} (based on ${sItem.numberOfFeedbacks} feedback(s))`}
                  </span>
                  <p className='essay-content-text'>
                    {sItem.content}
                  </p>
                </Link>
              </div>
            )}
          </Segment>
          : <Segment
            className='empty-list-box'
            loading={pageControl.isLoadingSubmission}>
            <Image
              src={EmptyListIcon}
              className="empty-list-image"
              avatar />
            <span className='empty-list-text'>
              No one has submitted his/her work for this question before.
            </span>
          </Segment>
        }
      </>
    </div>
  );
}

export default QuestionDetail;
