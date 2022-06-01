import { useState, useEffect } from 'react';
import axios from 'axios';
import { QuestionModel, defaultQuestionModel } from '../../../utils/QuestionUtils';
import { MarkingSchemeModel, defaultMarkingSchemeModel, AddEssayRequestBody } from '../../../utils/EssayUtils';
import { useHistory, useParams } from "react-router-dom";
import { Button, Table, Form, Accordion, Icon, Segment } from 'semantic-ui-react';
import './WriteEssay.css';

interface WriteEssayForm {
  currentMarkingScheme: MarkingSchemeModel;
  responseText: string;
  wordCount: number;
}

function WriteEssay(props) {

  let history = useHistory();

  const { questionId } = useParams<{ questionId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionModel>(defaultQuestionModel);
  const [markingSchemeOptions, setMarkingSchemeOptions] = useState([]);
  const [markingSchemeList, setMarkingSchemeList] = useState<Array<MarkingSchemeModel>>([]);
  const [writeEssayForm, setWriteEssayForm] = useState<WriteEssayForm>({
    currentMarkingScheme: defaultMarkingSchemeModel,
    responseText: '',
    wordCount: 0,
  });
  const [pageControl, setPageControl] = useState({
    isFormLoading: false,
    isMarkingAreaActice: true,
  });

  useEffect(() => {
    getCurrQuestion(questionId);
    getAllMarkingScheme();
  }, []);

  let getCurrQuestion = (id: string) => {
    axios.get(`/question/${id}`, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        setCurrentQuestion(res.data);
      })
  };

  let getAllMarkingScheme = () => {
    axios.get(`/essay/marking-scheme/all`, {
      headers: { "Authorization": `Bearer ${props.user.accessToken}` }
    })
      .then(res => {
        let optList = [];
        for (let i = 0; i < res.data.length; i++) {
          let opt = {
            key: res.data[i]._id,
            text: res.data[i].name,
            value: res.data[i].name,
          }
          optList.push(opt);
        }
        setMarkingSchemeOptions(optList);
        setMarkingSchemeList(res.data);
      })
  };

  let onChangeMarkingScheme = (e, { value }) => {
    let schemaIdx = markingSchemeList.findIndex((dItem) => dItem.name === value);
    if (schemaIdx !== -1) setWriteEssayForm({ ...writeEssayForm, currentMarkingScheme: markingSchemeList[schemaIdx] });
  }

  let toggleMarkingArea = () => {
    let nextValue = pageControl.isMarkingAreaActice ? false : true;
    setPageControl({ ...pageControl, isMarkingAreaActice: nextValue });
  }

  let onChangeResponseText = (e) => {
    setWriteEssayForm({
      ...writeEssayForm,
      responseText: e.target.value,
      wordCount: getWordCount(e.target.value)
    });
  }

  let getWordCount = (text: String): number => {
    let txtArray = text.split(" ");
    return txtArray.length;
  }

  let handleSubmit = (action: string) => {
    setPageControl({ ...pageControl, isFormLoading: true });
    if (writeEssayForm && writeEssayForm.responseText !== '') {
      let state: string;
      switch (action.toUpperCase()) {
        case "SUBMIT":
          state = "submission"
          break;
        case "SAVEASDRAFT":
          state = "draft"
          break;
        default:
          state = "draft"
      }
      let newEssay: AddEssayRequestBody = {
        questionId: currentQuestion._id,
        question: currentQuestion.question,
        submitterId: props.user._id,
        submitterName: props.user.username,
        markingSchemeId: writeEssayForm.currentMarkingScheme._id,
        markingSchemeName: writeEssayForm.currentMarkingScheme.name,
        state: state,
        content: writeEssayForm.responseText,
        wordCount: writeEssayForm.wordCount
      }
      axios.post(`/essay/add`, newEssay, {
        headers: { "Authorization": `Bearer ${props.user.accessToken}` }
      })
        .then(res => {
          setPageControl({ ...pageControl, isFormLoading: false });
          history.push(`/submission/${res.data._id}`);
        })
        .catch((err) => {
          console.log(err.message);
        })
    }
  }

  return (
    <div>
      <span className='response-heading-text'>
        Write an essay to question
      </span>
      <p className='response-question-content'>
        {currentQuestion ? currentQuestion.question : null}
      </p>
      <Form
        className='response-form'
        loading={pageControl.isFormLoading}>
        <Form.Field required>
          <label>Marking Scheme</label>
          <Form.Select
            options={markingSchemeOptions}
            onChange={onChangeMarkingScheme} />
        </Form.Field>

        {writeEssayForm
          && writeEssayForm.currentMarkingScheme
          && writeEssayForm.currentMarkingScheme.name !== '' ?
          <>
            <Segment className="marking-scheme-segment">
              <Icon name='info' className='marking-scheme-info-icon' />
              {writeEssayForm.currentMarkingScheme.minWords && writeEssayForm.currentMarkingScheme.minWords !== 0 ?
                <span className='marking-scheme-text'>
                  Min. Words: {writeEssayForm.currentMarkingScheme.minWords}
                </span>
                : null}
              {writeEssayForm.currentMarkingScheme.maxWords && writeEssayForm.currentMarkingScheme.maxWords !== 0 ?
                <span className='marking-scheme-text'>
                  Max. Words: {writeEssayForm.currentMarkingScheme.maxWords}
                </span>
                : null}
              {writeEssayForm.currentMarkingScheme.totalFullScore && writeEssayForm.currentMarkingScheme.totalFullScore !== 0 ?
                <span className='marking-scheme-text'>
                  Full Score: {writeEssayForm.currentMarkingScheme.totalFullScore}
                </span>
                : null}
            </Segment>
            {writeEssayForm.currentMarkingScheme.sections
              && writeEssayForm.currentMarkingScheme.sections.length !== 0 ?
              <>
                <Accordion
                  defaultActiveIndex={0}
                  onClick={() => toggleMarkingArea()}
                  fluid styled>
                  <Accordion.Title index={0}>
                    <Icon name='dropdown' />Marking Areas
                  </Accordion.Title>
                  <Accordion.Content
                    active={pageControl.isMarkingAreaActice}>
                    <Table celled className="marking-scheme-table">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Factor</Table.HeaderCell>
                          <Table.HeaderCell>Description</Table.HeaderCell>
                          <Table.HeaderCell>Score</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {writeEssayForm.currentMarkingScheme.sections
                          .map((mItem) => (
                            <Table.Row>
                              <Table.Cell width={3}
                                className="marking-scheme-table-emphasize">
                                <b>{mItem.description}</b>
                              </Table.Cell>
                              <Table.Cell width={7}>
                                {mItem.supplementaryText}
                              </Table.Cell>
                              <Table.Cell width={1}
                                className="marking-scheme-table-emphasize"
                                textAlign="center">
                                <b>{mItem.fullScore}</b>
                              </Table.Cell>
                            </Table.Row>
                          ))
                        }
                      </Table.Body >
                    </Table >
                  </Accordion.Content>
                </Accordion>
                <br />
              </>
              : null}
          </>
          : null
        }
        <Form.Field required>
          <label>Response</label>
          <Form.TextArea
            rows={20}
            onChange={onChangeResponseText} />
        </Form.Field>
        <span>Word Count: {writeEssayForm.wordCount}</span>
        <Button
          className='response-form-submit-btn'
          type='submit'
          onClick={() => handleSubmit("submit")}>
          Submit
        </Button>
        {/*
        <Button
          className='response-form-save-draft-btn'
          onClick={() => handleSubmit("saveAsDraft")}>
          Save as Draft
        </Button>
      */}
      </Form >
    </div >
  );
}

export default WriteEssay;