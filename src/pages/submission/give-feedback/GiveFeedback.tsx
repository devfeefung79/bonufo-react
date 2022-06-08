import { useState, useEffect } from 'react';
import { EssayModel, defaultEssayModel, MarkingSchemeModel, defaultMarkingSchemeModel } from '../../../utils/EssayUtils';
import { getEssayByEssayId, getMarkingSchemeById } from '../../../services/EssayService';
import { FeedbackModel, defaultFeedbackModel, AddFeedbackRequestBody } from '../../../utils/FeedbackUtils';
import { addFeedback } from '../../../services/FeedbackService';
import { useHistory, useParams } from "react-router-dom";
import { Button, Table, Form, Input, Segment, Grid, TextArea } from 'semantic-ui-react';
import './GiveFeedback.css';

function GiveFeedback(props) {

  let history = useHistory();

  const { essayId } = useParams<{ essayId: string }>();
  const [currentEssay, setCurrentEssay] = useState<EssayModel>(defaultEssayModel);
  const [currentMarkingScheme, setCurrentMarkingScheme] = useState<MarkingSchemeModel>(defaultMarkingSchemeModel);
  const [markingForm, setMarkingForm] = useState<FeedbackModel>(defaultFeedbackModel);

  useEffect(() => {
    getCurrentEssay(essayId, props.user.accessToken);
  }, [essayId, props.user.accessToken]);

  const getCurrentEssay = async (essayId: string, accessToken: string) => {
    const essay = await getEssayByEssayId(essayId, accessToken);
    if (essay) setCurrentEssay(essay);
    if (essay.markingSchemeId && essay.markingSchemeId !== '') {
      const markingScheme = await getMarkingSchemeById(essay.markingSchemeId, accessToken);
      if (markingScheme) {
        setCurrentMarkingScheme(markingScheme);
        setMarkingForm({ ...markingForm, sections: markingScheme.sections });
      }
    }
  };

  const updateTotalScore = () => {
    let newScore = 0;
    if (currentMarkingScheme && currentMarkingScheme.calculationMode) {
      for (let i = 0; i < markingForm.sections.length; i++) {
        if (markingForm.sections[i].score) {
          newScore += markingForm.sections[i].score;
        }
      }
    }
    switch (currentMarkingScheme.calculationMode.toUpperCase()) {
      case 'MEAN':
        newScore = newScore / markingForm.sections.length;
        break;
    }
    setMarkingForm({ ...markingForm, totalScore: newScore });
  }

  const onChangeSectionScore = async (e, { value }, sIndex) => {
    let newSection = markingForm.sections;
    newSection[sIndex].score = parseFloat(value);
    await setMarkingForm({ ...markingForm, sections: newSection });
    updateTotalScore();
  };

  const onChangeSectionComment = (e, { value }, sIndex) => {
    let newSection = markingForm.sections;
    newSection[sIndex].comment = value;
    setMarkingForm({ ...markingForm, sections: newSection });
  };

  const onChangeOverallComment = (e, { value }) => {
    setMarkingForm({ ...markingForm, overallComment: value });
  }

  const handleSubmit = async (essayId: string, accessToken: string) => {
    let newFeedback: AddFeedbackRequestBody = {
      essayId: essayId,
      essay: currentEssay.content,
      submitterId: props.user._id,
      submitterName: props.user.username,
      totalScore: markingForm.totalScore
    }
    if (markingForm.sections && markingForm.sections.length !== 0) {
      newFeedback.sections = markingForm.sections;
    }
    if (markingForm.overallComment && markingForm.overallComment !== '') {
      newFeedback.overallComment = markingForm.overallComment;
    }
    const feedback = await addFeedback(newFeedback, accessToken);
    if (feedback) history.push(`/submission/${essayId}`);
  }

  return (
    <div>
      <span className='feedback-heading-text'>
        Give a Feedback
      </span>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={8}>
            <>
              <>
                <span className='feedback-subheading-text'>
                  Question
                </span>
                <p>{currentEssay.question}</p>
              </>
              <Segment>
                <span className='feedback-subheading-text'>
                  Submission
                </span>
                <p>{currentEssay.content}</p>
              </Segment>
            </>
          </Grid.Column>
          <Grid.Column width={8}>
            <span className='feedback-subheading-text'>
              Marking Scheme
            </span>
            <Form className='marking-form'>
              <span className='feedback-subheading-text'>
                {currentMarkingScheme.name}
              </span>
              {currentMarkingScheme && currentMarkingScheme.minWords && currentMarkingScheme.minWords != 0 ?
                <span className='feedback-marking-text'>
                  Minimum words: {currentMarkingScheme.minWords}
                </span>
                : null}
              {currentMarkingScheme && currentMarkingScheme.maxWords && currentMarkingScheme.maxWords != 0 ?
                <span className='feedback-marking-text'>
                  Minimum words: {currentMarkingScheme.maxWords}
                </span>
                : null}
              {currentMarkingScheme.sections && currentMarkingScheme.sections.length !== 0 ?
                <Table className="marking-table">
                  <Table.Body>
                    {currentMarkingScheme.sections.map((sItem, sIndex, sArray) => (
                      <Table.Row>
                        <Table.Cell width={4}>{sItem.description}</Table.Cell>
                        <Table.Cell width={9}>
                          <Form.Field>
                            <TextArea
                              rows={3}
                              placeholder={`Write your comment for ${sItem.description}`}
                              onChange={(e, { value }) => onChangeSectionComment(e, { value }, sIndex)} />
                          </Form.Field>
                        </Table.Cell>
                        <Table.Cell width={1} textAlign='right'>
                          <Form.Field>
                            <Input onChange={(e, { value }) => onChangeSectionScore(e, { value }, sIndex)} />
                          </Form.Field>
                        </Table.Cell>
                        <Table.Cell width={2}>
                          <span className='section-fullscore-text'>{`/ ${sItem.fullScore}`}</span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    <Table.Row>
                      <Table.Cell colSpan='4'>
                        <TextArea
                          rows={3}
                          placeholder={`Write your comment for overall areas`}
                          onChange={onChangeOverallComment} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>Total Score</Table.Cell>
                      <Table.Cell width={9}></Table.Cell>
                      <Table.Cell colSpan='2'>{markingForm.totalScore} / {currentMarkingScheme.totalFullScore}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                : <>
                  <Form.Field>
                    <TextArea
                      rows={3}
                      placeholder={`Write your comment for overall areas`}
                      onChange={onChangeOverallComment} />
                  </Form.Field>
                  <span>Total Score: {markingForm.totalScore} / {currentMarkingScheme.totalFullScore}</span>
                </>
              }
              <Button
                className='feedback-form-submit-btn'
                type='submit'
                onClick={() => handleSubmit(essayId, props.user.accessToken)}>
                Submit
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default GiveFeedback;