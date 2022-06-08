import { useState, useEffect } from 'react';
import { QuestionModel } from '../../../utils/QuestionUtils';
import { getQuestionById } from '../../../services/QuestionService';
import { EssayModel } from '../../../utils/EssayUtils';
import { getEssayListByQuestionId } from '../../../services/EssayService';
import { Link, useParams } from "react-router-dom";
import { Segment, Divider, Button, Label, Placeholder } from 'semantic-ui-react';
import EmptyItemBox from '../../component/empty-item-box/EmptyItemBox';
import './QuestionDetail.css';

function QuestionDetail(props) {

  const { questionId } = useParams<{ questionId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionModel>();
  const [submissionList, setSubmissionList] = useState<Array<EssayModel>>([]);
  const [pageControl, setPageControl] = useState({
    isLoadingQuestion: false,
    isLoadingSubmission: false,
  })

  useEffect(() => {
    getcurrentQuestion(questionId, props.user.accessToken);
    getSubmissionList(questionId, props.user.accessToken);
  }, []);

  const getcurrentQuestion = async (questionId: string, accessToken: string) => {
    await setPageControl({ ...pageControl, isLoadingQuestion: true });
    const question = await getQuestionById(questionId, accessToken);
    if (question) setCurrentQuestion(question);
    setPageControl({ ...pageControl, isLoadingQuestion: false });
  };

  const getSubmissionList = async (questionId: string, accessToken: string) => {
    await setPageControl({ ...pageControl, isLoadingSubmission: true });
    const submissionList = await getEssayListByQuestionId(questionId, accessToken);
    if (submissionList) setSubmissionList(submissionList);
    setPageControl({ ...pageControl, isLoadingSubmission: false });
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
          :
          <EmptyItemBox description={`No one has submitted his/her work for this question before.`} />
        }
      </>
    </div>
  );
}

export default QuestionDetail;
