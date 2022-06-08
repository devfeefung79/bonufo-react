import { Link } from "react-router-dom";
import { Segment, Divider, Accordion, Icon } from 'semantic-ui-react'
import './SubmissionHistory.css';

interface Props {
  isLoading: boolean;
  submissionList: Array<any>;
  isAccordionActiveList: Array<number>;
  handleAccordionActiveList: (index: number) => void;
}

function SubmissionHistory(props: Props) {

  return (
    <Segment isLoading={props.isLoading}>
      <span className='profile-subheading-text'>
        Submission History
      </span>
      {props.submissionList && props.submissionList.length !== 0 ?
        props.submissionList.map((sItem, sIndex, sArray) =>
          <>
            <table className='profile-table' key={sIndex}>
              <tbody>
                <tr>
                  <td>
                    <p>#{sIndex + 1}</p>
                  </td>
                  <td>
                    <Accordion
                      fluid styled
                      className='profile-accordion'>
                      <Accordion.Title
                        index={sIndex}
                        onClick={() => props.handleAccordionActiveList(sIndex)}>
                        <Icon name='dropdown' />
                        Question
                      </Accordion.Title>
                      <Accordion.Content active={props.isAccordionActiveList.includes(sIndex)}>
                        <p>{sItem.question}</p>
                      </Accordion.Content>
                    </Accordion>
                    <Link to={`/submission/${sItem._id}`}>
                      <p className='profile-table-content'>{sItem.content}</p>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
            {sIndex !== sArray.length - 1 ?
              <Divider className='profile-divider' />
              : null}
          </>
        )
        : <span className='profile-empty-list-text'>
          No submission history
        </span>}
    </Segment>
  )
}

export default SubmissionHistory;