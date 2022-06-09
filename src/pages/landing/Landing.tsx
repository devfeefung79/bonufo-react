import { useState } from 'react';
import './Landing.css';
import RegisterUserForm from './register-form/RegisterForm';
import LoginUserForm from './login-form/LoginForm';

function Landing(props) {

  const [action, setAction] = useState('LOGIN');

  const toggleAction = (action: string) => {
    setAction(action);
  }

  return (
    <div className="ui stackable middle aligned grid">
      <div className="left floated eight wide column">
        <div className="desp-area">
          <span className='landing-main-text'>BONUFO</span>
          <span className='landing-desp-text'>
            A free platform.
            Practice your writing skill as learner or assess students' work as tutor
          </span>
        </div>
      </div>
      <div className="right floated eight wide column">
        <div className="form-area">
          {action === 'REGISTER' ?
            <RegisterUserForm
              toggleAction={(action) => toggleAction(action)}
              handleSuccessLogin={(accessToken) => props.handleSuccessLogin(accessToken)} />
            : null}
          {action === 'LOGIN' ?
            <LoginUserForm
              toggleAction={(action) => toggleAction(action)}
              handleSuccessLogin={(accessToken) => props.handleSuccessLogin(accessToken)} />
            : null}
        </div>
      </div>
    </div >
  );
}

export default Landing;
