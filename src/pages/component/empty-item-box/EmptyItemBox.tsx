import { Segment, Image } from 'semantic-ui-react';
import EmptyListIcon from '../../../assets/bear-5846065_960_720.jpg';
import PropTypes from 'prop-types';
import './EmptyItemBox.css';

function NotFound(props) {
  return (
    <Segment
      className='empty-list-box'>
      <Image
        src={EmptyListIcon}
        className="empty-list-image"
        avatar />
      <span className='empty-list-text'>
        {props.description}
      </span>
    </Segment>
  );
}

NotFound.propTypes = {
  description: PropTypes.string
};

export default NotFound;
