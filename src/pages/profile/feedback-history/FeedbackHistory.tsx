import { Link } from "react-router-dom";
import { Segment, Divider, Accordion, Icon } from 'semantic-ui-react'
import { FeedbackModel } from '../../../utils/FeedbackUtils';
import './FeedbackHistory.css';

interface Props {
  isLoading: boolean;
  feedbackList: Array<FeedbackModel>;
  isAccordionActiveList: Array<any>;
  handleAccordionActiveList: (index: number) => void;
}

function FeedbackHistory(props: Props) {

  return (
    <Segment isLoading={props.isLoading}>
      <span className='profile-subheading-text'>
        Feedback History
      </span>
      {props.feedbackList && props.feedbackList.length !== 0 ?
        props.feedbackList.map((fItem, fIndex, fArray) =>
          <>
            <table className='profile-feedback-history-table' key={fIndex}>
              <tr>
                <td>
                  <p>#{fIndex + 1}</p>
                </td>
                <td>
                  <Accordion
                    fluid styled
                    className='profile-accordion'>
                    <Accordion.Title
                      index={fIndex}
                      onClick={() => props.handleAccordionActiveList(fIndex)}>
                      <Icon name='dropdown' />
                      Submission
                    </Accordion.Title>
                    <Accordion.Content active={props.isAccordionActiveList.includes(fIndex)}>
                      <Link to={`/submission/${fItem.essayId}`}>
                        <p>{fItem.essay}</p>
                      </Link>
                    </Accordion.Content>
                  </Accordion>
                  <table className='profile-feedback-section-table'>
                    {fItem.sections && fItem.sections.map((section) =>
                      <tr>
                        <td>{section.description}</td>
                        <td>{section.comment}</td>
                        <td>{section.score} / {section.fullScore}</td>
                      </tr>
                    )}
                    <tr>
                      <td>Overall Comment</td>
                      <td colSpan={2}>{fItem.overallComment}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>Total Score</td>
                      <td>{fItem.totalScore}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            {fIndex != fArray.length - 1 ?
              <Divider className='profile-divider' />
              : null}
          </>
        )
        : <span className='profile-empty-list-text'>
          No feedback history
        </span>}
    </Segment>
  )
}

export default FeedbackHistory;