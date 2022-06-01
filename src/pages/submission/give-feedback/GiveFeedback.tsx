import { useState, useEffect } from 'react';
import {
  EssayModel,
  defaultEssayModel,
  MarkingSchemeModel,
  defaultMarkingSchemeModel
} from '../../../utils/EssayUtils';
import { FeedbackModel, defaultFeedbackModel, AddFeedbackRequestBody } from '../../../utils/FeedbackUtils';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { Button, Table, Form, Input, Icon, Segment, Grid, GridColumn, TextArea } from 'semantic-ui-react';
import './GiveFeedback.css';

const BASE_URL = `https://bonufo-express.vercel.app`;

function GiveFeedback(props) {

  let history = useHistory();
  let { essayId } = useParams<{ essayId: string }>();

  let [currentEssay, setCurrentEssay] = useState<EssayModel>(defaultEssayModel);
  let [currentMarkingScheme, setCurrentMarkingScheme] = useState<MarkingSchemeModel>(defaultMarkingSchemeModel);
  let [markingForm, setMarkingForm] = useState<FeedbackModel>(defaultFeedbackModel);

  useEffect(() => {
    getCurrEssay(essayId);
  }, []);

  let getCurrEssay = (id: string) => {
    axios.get(`${BASE_URL}/essay/${id}`, {
      headers: {
        "access-control-allow-origin": "*",
        "Authorization": `Bearer ${props.user.accessToken}`
      }
    })
      .then(res => {
        setCurrentEssay(res.data);
        if (res.data.markingSchemeId && res.data.markingSchemeId !== '') {
          axios.get(`${BASE_URL}/essay/marking-scheme/${res.data.markingSchemeId}`)
            .then(res => {
              setCurrentMarkingScheme(res.data);
              setMarkingForm({ ...markingForm, sections: res.data.sections });
            })
        }
      })
  };

  let updateTotalScore = () => {
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

  let onChangeSectionScore = async (e, { value }, sIndex) => {
    let newSection = markingForm.sections;
    newSection[sIndex].score = parseFloat(value);
    await setMarkingForm({ ...markingForm, sections: newSection });
    updateTotalScore();
  };

  let onChangeSectionComment = (e, { value }, sIndex) => {
    let newSection = markingForm.sections;
    newSection[sIndex].comment = value;
    setMarkingForm({ ...markingForm, sections: newSection });
  };

  let onChangeOverallComment = (e, { value }) => {
    setMarkingForm({ ...markingForm, overallComment: value });
  }

  let handleSubmit = () => {
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
    axios.post(`/feedback/add`, newFeedback, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        history.push(`/submission/${essayId}`);
      })
      .catch((err) => {
        console.log(err.message);
      })
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
                onClick={() => handleSubmit()}>
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