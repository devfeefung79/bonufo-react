import { useState, useEffect } from 'react';
import { QuestionModel, defaultQuestionModel } from '../../../utils/QuestionUtils';
import { getQuestionById } from '../../../services/QuestionService';
import { MarkingSchemeModel, defaultMarkingSchemeModel, AddEssayRequestBody } from '../../../utils/EssayUtils';
import { getMarkingSchemeList, addEssay } from '../../../services/EssayService';
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
    getCurrentQuestion(questionId, props.user.accessToken);
    getAllMarkingScheme(props.user.accessToken);
  }, [questionId, props.user.accessToken]);

  const getCurrentQuestion = async (questionId: string, accessToken: string) => {
    const question = await getQuestionById(questionId, accessToken);
    if (question) setCurrentQuestion(question);
  };

  const getAllMarkingScheme = async (accessToken: string) => {
    const markingSchemeList = await getMarkingSchemeList(accessToken);
    if (markingSchemeList) {
      let optList = [];
      for (let i = 0; i < markingSchemeList.length; i++) {
        let opt = {
          key: markingSchemeList[i]._id,
          text: markingSchemeList[i].name,
          value: markingSchemeList[i].name,
        }
        optList.push(opt);
      }
      setMarkingSchemeOptions(optList);
      setMarkingSchemeList(markingSchemeList);
    }
  };

  const onChangeMarkingScheme = (e, { value }) => {
    let schemaIdx = markingSchemeList.findIndex((dItem) => dItem.name === value);
    if (schemaIdx !== -1) setWriteEssayForm({ ...writeEssayForm, currentMarkingScheme: markingSchemeList[schemaIdx] });
  }

  const toggleMarkingArea = () => {
    const nextValue = pageControl.isMarkingAreaActice ? false : true;
    setPageControl({ ...pageControl, isMarkingAreaActice: nextValue });
  }

  const onChangeResponseText = (e) => {
    setWriteEssayForm({
      ...writeEssayForm,
      responseText: e.target.value,
      wordCount: getWordCount(e.target.value)
    });
  }

  const getWordCount = (text: String): number => {
    const txtArray = text.split(" ");
    return txtArray.length;
  }

  const handleSubmit = async (action: string, accessToken: string) => {
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
      const newEssay: AddEssayRequestBody = {
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
      const essay = await addEssay(newEssay, accessToken);
      if (essay) history.push(`/submission/${essay._id}`);
    }
    setPageControl({ ...pageControl, isFormLoading: false });
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
                          .map((mItem, mIndex) => (
                            <Table.Row key={mIndex}>
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
          onClick={() => handleSubmit("submit", props.user.accessToken)}>
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