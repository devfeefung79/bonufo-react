import React, { useState, useEffect } from 'react';
import { SearchForm, defaultSearchForm, DropdownOption, SearchFormRequestBody } from '../../../utils/FormUtils';
import { QuestionModel, SavedQuestionModel, QuestionTagModel } from '../../../utils/QuestionUtils';
import {
  getQuestionList,
  getQuestionListByFilter,
  getTopicList,
  getQuestionTypeList,
  getExamList,
  getSavedQuestionListByUserId,
  addSavedQuestion,
  deleteSavedQuestion
} from '../../../services/QuestionService';
import './Search.css';
import { Link } from "react-router-dom";
import { Segment, Divider, Button, Form, Label } from 'semantic-ui-react';

function Search(props) {

  const [topicOptions, setTopicOptions] = useState<Array<DropdownOption>>([]);
  const [questionTypeOptions, setQuestionTypeOptions] = useState<Array<DropdownOption>>([]);
  const [relatedExamOptions, setRelatedExamOptions] = useState<Array<DropdownOption>>([]);
  const [questions, setQuestions] = useState<Array<QuestionModel>>([]);
  const [savedQuestions, setSavedQuestions] = useState<Array<SavedQuestionModel>>([]);
  const [searchForm, setSearchForm] = useState<SearchForm>(defaultSearchForm);
  const [pageControl, setPageControl] = useState({
    isQuestionsLoading: false,
  });

  useEffect(() => {
    getTopicOpt(props.user.accessToken);
    getQuestionTypeOpt(props.user.accessToken);
    getExamOpt(props.user.accessToken);
    getAllQuestion(props.user.accessToken);
    getSavedQuestion(props.user._id, props.user.accessToken);
  }, [props.user._id, props.user.accessToken]);

  const getAllQuestion = async (accessToken: string) => {
    setPageControl({ ...pageControl, isQuestionsLoading: true });
    let questionList = await getQuestionList(accessToken);
    if (questionList) setQuestions(questionList);
    setPageControl({ ...pageControl, isQuestionsLoading: false });
  };

  const getOptList = (data: Array<QuestionTagModel>) => {
    let optList: Array<DropdownOption> = [];
    for (let i = 0; i < data.length; i++) {
      let opt: DropdownOption = {
        key: data[i]._id,
        text: data[i].label,
        value: data[i].label,
      }
      optList.push(opt);
    }
    return optList;
  };

  const getTopicOpt = async (accessToken: string) => {
    const topics = await getTopicList(accessToken);
    let optList;
    if (topics) optList = getOptList(topics);
    setTopicOptions(optList);
  };

  const getQuestionTypeOpt = async (accessToken: string) => {
    const questionTypes = await getQuestionTypeList(accessToken);
    let optList;
    if (questionTypes) optList = getOptList(questionTypes);
    setQuestionTypeOptions(optList);
  };

  const getExamOpt = async (accessToken: string) => {
    const exams = await getExamList(accessToken);
    let optList;
    if (exams) optList = getOptList(exams);
    setRelatedExamOptions(optList);
  };

  const getSavedQuestion = async (userId: string, accessToken: string) => {
    const savedQuestionList = await getSavedQuestionListByUserId(userId, accessToken);
    if (savedQuestionList) setSavedQuestions(savedQuestionList);
  }

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchForm({ ...searchForm, keyword: e.target.value });
  };

  const onChangeTopic = (e, { value }) => {
    setSearchForm({ ...searchForm, topic: value });
  };

  const onChangeQuestionType = (e, { value }) => {
    setSearchForm({ ...searchForm, questionType: value });
  };

  const onChangeExam = (e, { value }) => {
    setSearchForm({ ...searchForm, exam: value });
  };

  const onClickClear = () => {
    setSearchForm({ ...searchForm, ...defaultSearchForm });
  };

  const onSubmit = async (accessToken: string) => {
    if (searchForm === defaultSearchForm) {
      getAllQuestion(accessToken);
    }
    else {
      let requestBody: SearchFormRequestBody = {};
      if (searchForm.keyword && searchForm.keyword !== '' && searchForm.keyword.length !== 0) {
        requestBody.keyword = searchForm.keyword;
      }
      if (searchForm.topic && searchForm.topic.length !== 0) {
        requestBody.topic = searchForm.topic;
      }
      if (searchForm.questionType && searchForm.questionType.length !== 0) {
        requestBody.questionType = searchForm.questionType;
      }
      if (searchForm.exam && searchForm.exam.length !== 0) {
        requestBody.exam = searchForm.exam;
      }
      setPageControl({ ...pageControl, isQuestionsLoading: true });
      const questionList = await getQuestionListByFilter(requestBody, accessToken);
      if (questionList) setQuestions(questionList);
      setPageControl({ ...pageControl, isQuestionsLoading: false });
    }
  }

  const saveQuestion = async (savedQuestionData: { userId: string, questionId: string, question: string }, accessToken: string) => {
    await addSavedQuestion(savedQuestionData, accessToken);
    getSavedQuestion(savedQuestionData.userId, accessToken);
  }

  const unsaveQuestion = async (userId: string, questionId: string, accessToken: string) => {
    await deleteSavedQuestion(userId, questionId, accessToken);
    getSavedQuestion(userId, accessToken);
  }

  return (
    <>
      <>
        <span className='section-heading-text'>Search</span>
        <Form className='search-form'>
          <Form.Group widths='equal'>
            <Form.Input
              placeholder='Keyword'
              onChange={onChangeKeyword}
              value={searchForm.keyword} />
            <Form.Select
              multiple
              options={topicOptions}
              placeholder='Topic'
              className='topic-select'
              onChange={onChangeTopic}
              value={searchForm.topic}
            />
            <Form.Select
              multiple
              options={questionTypeOptions}
              placeholder='Question Type'
              className='question-type-select'
              onChange={onChangeQuestionType}
              value={searchForm.questionType}
            />
            <Form.Select
              multiple
              options={relatedExamOptions}
              placeholder='Related Exam'
              className='exam-select'
              onChange={onChangeExam}
              value={searchForm.exam}
            />
          </Form.Group>
          <Button
            className='submit-button'
            type='submit'
            onClick={() => onSubmit(props.user.accessToken)}>
            Submit
          </Button>
          <Button
            className='clear-button'
            onClick={onClickClear}>
            Clear All
          </Button>
          <br />
          <br />
        </Form>
      </>
      <Segment loading={pageControl.isQuestionsLoading}>
        <span className='result-count'>
          {questions && questions.length} Result(s)
        </span>
        <span className='question-text'>Question</span>
        {questions.map((qItem, index) =>
          <div key={index}>
            <Divider />
            {qItem.topic.map((tItem) =>
              <Label className='topic-label' key={tItem}>
                {tItem}
              </Label>
            )}
            {qItem.questionType.map((pItem) =>
              <Label className='question-type-label' key={pItem}>
                {pItem}
              </Label>
            )}
            {savedQuestions.find((sItem) => sItem.questionId === qItem._id) ?
              <button
                className='search-save-icon'
                onClick={() => unsaveQuestion(props.user._id, qItem._id, props.user.accessToken)}
              >
                <i className="star icon"></i>
              </button> :
              <button
                className='search-save-icon'
                onClick={() => saveQuestion({ userId: props.user._id, questionId: qItem._id, question: qItem.question }, props.user.accessToken)}
              >
                <i className="star icon outline"></i>
              </button>
            }
            {
              qItem.relatedExam.map((eItem) =>
                <Label className='exam-label' key={eItem}>
                  {eItem}
                </Label>
              )
            }
            < Link to={`/question/${qItem._id}`}>
              <p className='question-content-text'>{qItem.question}</p>
            </Link>
          </div>
        )
        }
      </Segment>
    </>
  );
}

export default Search;
