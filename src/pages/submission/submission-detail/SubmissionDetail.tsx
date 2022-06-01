import { useState, useEffect } from 'react';
import { EssayModel, defaultEssayModel } from '../../../utils/EssayUtils';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { Placeholder, Segment, Button, Image, Divider, Grid } from 'semantic-ui-react';
import EmptyListIcon from '../../../assets/bear-5846065_960_720.jpg';
import './SubmissionDetail.css';

const BASE_URL = `https://bonufo-express.vercel.app/`;

function SubmissionDetail(props) {

  let { essayId } = useParams<{ essayId: string }>();
  let [currentEssay, setCurrentEssay] = useState<EssayModel>(defaultEssayModel);
  let [feedbackList, setFeedbackList] = useState([]);
  let [pageControl, setPageControl] = useState({
    isLoadingEssay: false,
    isLoadingFeedback: false,
  });

  useEffect(() => {
    getCurrentEssay(essayId);
    getFeedbackList(essayId);
  }, []);

  let getCurrentEssay = async (id: string) => {
    await setPageControl({ ...pageControl, isLoadingEssay: true });
    axios.get(`${BASE_URL}/essay/${id}`, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        setCurrentEssay(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setPageControl({ ...pageControl, isLoadingEssay: false });
      })
  };

  let getFeedbackList = async (id: string) => {
    await setPageControl({ ...pageControl, isLoadingFeedback: true });
    axios.get(`${BASE_URL}/feedback/by-essay/${id}`, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        setFeedbackList(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setPageControl({ ...pageControl, isLoadingFeedback: false });
      })
  }

  return (
    <div>
      <>{pageControl.isLoadingEssay ?
        <Placeholder>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
        :
        <>
          {props && props.user && props.user.role === 'Tutor' ?
            <div className='write-feedback-button-box'>
              <Link to={`/question/${essayId}/write-feedback`}>
                <Button
                  className='write-feedback-button'>
                  Give a feedback
                </Button>
              </Link>
            </div>
            : null}
          <span className='submission-heading-text'>
            View Submission
          </span>
          <div className='submission-box'>
            <span className='submitter-name-text'>
              Submitted by {currentEssay.submitterName}
            </span>
            <span className='average-score-text'>
              Average Score: {currentEssay.numberOfFeedbacks === 0 ?
                'N/A' :
                `${currentEssay.averageScore} (based on ${currentEssay.numberOfFeedbacks} feedback(s))`}
            </span>
            <p className='essay-content-text'>
              {currentEssay.content}
            </p>
          </div>
        </>
      }
      </>
      <>
        {!pageControl.isLoadingFeedback && feedbackList && feedbackList.length !== 0 ?
          <Segment loading={pageControl.isLoadingFeedback}>
            <span className='result-count'>
              {feedbackList && feedbackList.length} Result(s)
            </span>
            <span className='prev-submission-text'>
              Previous Feedbacks
            </span>
            {feedbackList.map((fItem) =>
              <div>
                <Divider />
                <span className='submitter-name-text'>
                  Commented by {fItem.submitterName}
                </span>
                <br />
                <br />
                {fItem.sections && fItem.sections.length !== 0 ?
                  <>
                    <Grid columns={fItem.sections.length}>
                      <Grid.Row>
                        {fItem.sections.map((section) =>
                          <Grid.Column mobile={16} tablet={8} computer={4}>
                            <div className='feedback-content-box'>
                              <span className='feedback-section-description'>
                                {section.description}
                              </span>
                              <span className='feedback-label-text'>
                                Score:
                              </span>
                              <span className='feedback-value-text'>
                                {section.score} / {section.fullScore}
                              </span>
                            </div>
                            {section.comment ?
                              <div className='feedback-content-box'>
                                <span className='feedback-label-text'>
                                  Comment:
                                </span>
                                <p className='feedback-value-text'>
                                  {section.comment}
                                </p>
                              </div>
                              : null}
                          </Grid.Column>)}
                      </Grid.Row>
                    </Grid>
                  </>
                  : null}
                <div className='feedback-content-box'>
                  <span className='feedback-label-text'>
                    Total Score:
                  </span>
                  <span className='feedback-value-text'>
                    {fItem.totalScore}
                  </span>
                </div>
                <div className='feedback-content-box'>
                  <span className='feedback-label-text'>
                    Overall Comment:
                  </span>
                  <p className='feedback-value-text'>
                    {fItem.overallComment}
                  </p>
                </div>
              </div>
            )}
          </Segment> :
          <Segment
            className='empty-list-box'
            loading={pageControl.isLoadingFeedback}>
            <Image
              src={EmptyListIcon}
              className="empty-list-image"
              avatar />
            <span className='empty-list-text'>
              {`No one has rated ${currentEssay.submitterName}'s essay for this question before.`}
            </span>
          </Segment>}
      </>
    </div>
  );
}

export default SubmissionDetail;
