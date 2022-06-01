import { Segment, Image } from 'semantic-ui-react';
import EmptyListIcon from '../../assets/bear-5846065_960_720.jpg';
import './NotFound.css';

function NotFound() {
  return (
    <Segment
      className='empty-list-box'>
      <Image
        src={EmptyListIcon}
        className="empty-list-image"
        avatar />
      <span className='empty-list-text'>
        Page Not Found. Please check if your URL is correct!
      </span>
    </Segment>
  );
}

export default NotFound;
