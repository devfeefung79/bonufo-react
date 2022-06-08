import { useState, useEffect } from 'react';
import { EssayModel, defaultEssayModel } from '../../../utils/EssayUtils';
import { getEssayByEssayId } from '../../../services/EssayService';
import { FeedbackModel } from '../../../utils/FeedbackUtils';
import { getFeedbackListByEssayId } from '../../../services/FeedbackService';
import { Link, useParams } from "react-router-dom";
import { Placeholder, Segment, Button, Divider, Grid } from 'semantic-ui-react';
import EmptyItemBox from '../../component/empty-item-box/EmptyItemBox';
import './SubmissionDetail.css';

function SubmissionDetail(props) {

  const { essayId } = useParams<{ essayId: string }>();
  const [currentEssay, setCurrentEssay] = useState<EssayModel>(defaultEssayModel);
  const [feedbackList, setFeedbackList] = useState([]);
  const [pageControl, setPageControl] = useState({
    isLoadingEssay: false,
    isLoadingFeedback: false,
  });

  useEffect(() => {
    getCurrentEssay(essayId, props.user.accessToken);
    getFeedbackList(essayId, props.user.accessToken);
  }, [essayId, props.user.accessToken]);

  const getCurrentEssay = async (essayId: string, accessToken: string) => {
    await setPageControl({ ...pageControl, isLoadingEssay: true });
    const essay = await getEssayByEssayId(essayId, accessToken);
    if (essay) setCurrentEssay(essay);
    setPageControl({ ...pageControl, isLoadingEssay: false });
  };

  const getFeedbackList = async (essayId: string, accessToken: string) => {
    await setPageControl({ ...pageControl, isLoadingFeedback: true });
    const feedbackList = await getFeedbackListByEssayId(essayId, accessToken);
    if (feedbackList) setFeedbackList(feedbackList);
    setPageControl({ ...pageControl, isLoadingFeedback: false });
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
                        {fItem.sections.map((sItem, sIndex) =>
                          <Grid.Column key={sIndex} mobile={16} tablet={8} computer={4}>
                            <div className='feedback-content-box'>
                              <span className='feedback-section-description'>
                                {sItem.description}
                              </span>
                              <span className='feedback-label-text'>
                                Score:
                              </span>
                              <span className='feedback-value-text'>
                                {sItem.score} / {sItem.fullScore}
                              </span>
                            </div>
                            {sItem.comment ?
                              <div className='feedback-content-box'>
                                <span className='feedback-label-text'>
                                  Comment:
                                </span>
                                <p className='feedback-value-text'>
                                  {sItem.comment}
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
          <EmptyItemBox description={`No one has rated ${currentEssay.submitterName}'s essay for this question before.`} />
        }
      </>
    </div>
  );
}

export default SubmissionDetail;
