import { Link } from "react-router-dom";
import { Segment, Divider } from 'semantic-ui-react'
import './SavedQuestion.css';

interface Props {
  isLoading: boolean;
  userId: string;
  savedQuestions: Array<any>;
  unsaveQuestion: (userId: string, questionId: string) => void;
}

function SavedQuestion(props: Props) {

  return (
    <Segment loading={props.isLoading}>
      <span className='profile-subheading-text'>
        My Saved Question
      </span>
      {props.savedQuestions && props.savedQuestions.length !== 0 ?
        props.savedQuestions.map((sItem, sIndex, sArray) =>
          <>
            <table className='profile-table'>
              <tr>
                <td>
                  <p>#{sIndex + 1}</p>
                </td>
                <td>
                  <Link to={`/question/${sItem.questionId}`}>
                    <p>{sItem.question}</p>
                  </Link>
                </td>
                <td>
                  <button onClick={() => props.unsaveQuestion(props.userId, sItem.questionId)}>
                    <i className="star icon"></i>
                  </button>
                </td>
              </tr>
            </table>
            {sIndex != sArray.length - 1 ?
              <Divider className='profile-divider' />
              : null}
          </>
        )
        : <span className='profile-empty-list-text'>No saved question</span>}
    </Segment>
  )
}

export default SavedQuestion;
