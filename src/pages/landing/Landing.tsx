import React, { useState } from 'react';
import axios from 'axios';
import { Segment, Button, Checkbox, Form, Input } from 'semantic-ui-react';
import {
  LoginForm, defaultLoginForm, defaultLoginFormControl, LoginFormRequestBody,
  RegisterForm, defaultRegisterForm, defaultRegisterFormControl, RegisterFormRequestBody
} from '../../utils/FormUtils';
import './Landing.css';

function Landing(props) {

  const [action, setAction] = useState('LOGIN');
  const [loginFormData, setLoginFormData] = useState<LoginForm>(defaultLoginForm);
  const [registerFormData, setRegisterFormData] = useState<RegisterForm>(defaultRegisterForm);
  const [registerFormControl, setRegisterFormControl] = useState(defaultRegisterFormControl);
  const [loginFormControl, setLoginFormControl] = useState(defaultLoginFormControl);

  let onChangeLoginUsernameEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, usernameEmail: e.target.value });
  }

  let onChangeLoginPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, password: e.target.value });
  }

  let onChangeRegUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, username: e.target.value });
  }

  let onChangeRegEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, email: e.target.value });
  }

  let onChangeRegPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, password: e.target.value });
  }

  let onChangeRegConfirmPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, confirmPassword: e.target.value });
  }

  let onChangeRegRoleLearner = () => {
    setRegisterFormData({
      ...registerFormData, role: {
        learner: true,
        tutor: false,
      }
    });
  }

  let onChangeRegRoleTutor = () => {
    setRegisterFormData({
      ...registerFormData, role: {
        learner: false,
        tutor: true,
      }
    });
  }

  let onChangeRegTerm = () => {
    var nextValue = registerFormData.termCondition === true ? false : true;
    setRegisterFormData({ ...registerFormData, termCondition: nextValue });
  }

  let handleRegister = (formControlDefault) => {
    const isPass = validateRegisterForm(formControlDefault);
    if (isPass) {
      let roleStr = registerFormData.role.learner ? 'Learner' : 'Tutor';
      let requestBody: RegisterFormRequestBody = {
        username: registerFormData.username,
        email: registerFormData.email,
        password: registerFormData.password,
        role: roleStr,
      }
      axios.post('/user/signup', requestBody)
        .then(res => {
          if (res.data) {
            requestLogin(requestBody);
          }
        })
        .catch(err => {
          let isDupUser = err.response.data.message === 'Duplicate user' ? true : false;
          let isDupEmail = err.response.data.message === 'Duplicate email' ? true : false;
          if (err.response.status === 409 && isDupUser) {
            setRegisterFormControl({
              ...registerFormControl,
              username: true,
              email: formControlDefault.email,
              password: formControlDefault.password,
              confirmPassword: formControlDefault.confirmPassword,
              role: formControlDefault.role,
              termCondition: formControlDefault.termCondition,
              messageList: ['This username has been used already']
            });
          } else if (err.response.status === 409 && isDupEmail) {
            setRegisterFormControl({
              ...registerFormControl,
              username: formControlDefault.username,
              email: true,
              password: formControlDefault.password,
              confirmPassword: formControlDefault.confirmPassword,
              role: formControlDefault.role,
              termCondition: formControlDefault.termCondition,
              messageList: ['This email has been registered already']
            });
          }
        })
    }
  }

  function validateRegisterForm(formControlDefault): boolean {
    let checkFormError = formControlDefault;
    const usernameRegEx = /[a-zA-Z]{1,}[0-9a-zA-Z]{5,}/;
    if (!usernameRegEx.test(registerFormData.username)) {
      checkFormError.username = true;
      checkFormError.messageList.push('\n\rUsername should be start with character (A-Z) with a minimum length of 6');
    }
    const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegEx.test(registerFormData.email)) {
      checkFormError.email = true;
      checkFormError.messageList.push('Invalid email address');
    }
    const passwordRegEx = /^\w.*\w$/;
    if (!(registerFormData.password.length >= 8 && passwordRegEx.test(registerFormData.password))) {
      checkFormError.password = true;
      checkFormError.messageList.push('Password must be at least 8 characters long, start and end with character (A-Z)');
    }
    if (!(registerFormData.confirmPassword.length != 0 && registerFormData.confirmPassword === registerFormData.password)) {
      checkFormError.confirmPassword = true;
      checkFormError.messageList.push('Please check if confirm password is same as password');
    }
    if (!(registerFormData.role.learner || registerFormData.role.tutor)) {
      checkFormError.role = true;
      checkFormError.messageList.push('Please select one role');
    }
    if (!registerFormData.termCondition) {
      checkFormError.termCondition = true;
      checkFormError.messageList.push('Agreement to the Terms and Conditions is required');
    }
    setRegisterFormControl({
      ...registerFormControl,
      username: checkFormError.username,
      email: checkFormError.email,
      password: checkFormError.password,
      confirmPassword: checkFormError.confirmPassword,
      role: checkFormError.role,
      termCondition: checkFormError.termCondition,
      messageList: checkFormError.messageList
    });
    return checkFormError.messageList && checkFormError.messageList.length === 0 ? true : false;
  }

  let handleLogin = (formControlDefault) => {
    const isPass = validateLoginForm(formControlDefault);
    let requestBody: LoginFormRequestBody = {
      password: loginFormData.password,
    };
    const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailRegEx.test(loginFormData.usernameEmail)) {
      requestBody.email = loginFormData.usernameEmail;
    } else {
      requestBody.username = loginFormData.usernameEmail;
    }
    if (isPass) requestLogin(requestBody);
  }

  let requestLogin = (requestBody: LoginFormRequestBody) => {
    axios.post('/user/login', requestBody)
      .then(res => {
        props.handleSuccessLogin(res.data.accessToken);
      })
      .catch((err) => {
        console.log(err.message);
      })
  }

  let validateLoginForm = (formControlDefault): boolean => {
    let checkFormError = formControlDefault;
    if (loginFormData.usernameEmail === '' || loginFormData.usernameEmail.length === 0) {
      checkFormError.usernameEmail = true;
      checkFormError.messageList.push('Username or email cannot be empty');
    }
    if (loginFormData.password === '' || loginFormData.password.length === 0) {
      checkFormError.password = true;
      checkFormError.messageList.push('Password cannot be empty');
    }
    setLoginFormControl({
      ...loginFormControl,
      usernameEmail: checkFormError.usernameEmail,
      password: checkFormError.password,
      messageList: checkFormError.messageList
    });
    return checkFormError.messageList && checkFormError.messageList.length === 0 ? true : false;
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
            <Segment className='register-form-segment'>
              <div className='action-swift-box'>
                <span
                  className='action-swift-text'
                  onClick={() => setAction('LOGIN')}>
                  Already have an account?
                </span>
              </div>
              <span className='register-form-heading-text'>
                Get Started with Simple Steps!
              </span>
              {registerFormControl && registerFormControl.messageList && registerFormControl.messageList.length !== 0 ?
                <div className="ui error message">
                  <div className="header">Error occurred</div>
                  <p>Please check the following:
                    <ul>
                      {registerFormControl.messageList.map((msg) =>
                        <li>{msg}</li>
                      )}
                    </ul>
                  </p>
                </div> : null}
              <Form
                className='register-form'
                loading={registerFormControl.isLoading}>
                <Form.Field
                  error={registerFormControl.username}
                  required>
                  <label>Username</label>
                  <Input
                    placeholder='Please input your name'
                    onChange={(e) => onChangeRegUsername(e)} />
                </Form.Field>
                <Form.Field
                  error={registerFormControl.email}
                  required>
                  <label>Email Address</label>
                  <Input
                    placeholder='Please input your email address'
                    onChange={(e) => onChangeRegEmail(e)} />
                </Form.Field>
                <Form.Field
                  error={registerFormControl.password}
                  required>
                  <label>Password</label>
                  <Input
                    placeholder='Please input your password'
                    type='password'
                    onChange={(e) => onChangeRegPw(e)} />
                </Form.Field>
                <Form.Field
                  error={registerFormControl.confirmPassword}
                  required>
                  <label>Confirm Password</label>
                  <Input
                    placeholder='Please input your password again'
                    type='password'
                    onChange={(e) => onChangeRegConfirmPw(e)} />
                </Form.Field>
                <Form.Field
                  error={registerFormControl.role}
                  inline
                  required>
                  <label>Role</label>
                  <Form.Group>
                    <Form.Radio
                      label='Learner'
                      value='learner'
                      checked={registerFormData.role.learner}
                      onChange={onChangeRegRoleLearner}
                    />
                    <Form.Radio
                      label='Tutor'
                      value='tutor'
                      checked={registerFormData.role.tutor}
                      onChange={onChangeRegRoleTutor}
                    />
                  </Form.Group>
                </Form.Field>
                <Form.Field
                  error={registerFormControl.termCondition}>
                  <Checkbox
                    className='register-form-chx'
                    label='I agree to the Terms and Conditions'
                    checked={registerFormData.termCondition}
                    onChange={onChangeRegTerm}
                  />
                  <span className='register-form-chx-req'> *</span>
                </Form.Field>
                <Button
                  className='register-form-submit-btn'
                  type='submit'
                  onClick={() => handleRegister(defaultRegisterFormControl)}>
                  Register
                </Button>
              </Form>
              <br />
            </Segment> : null}
          {action === 'LOGIN' ?
            <Segment className='login-form-segment'>
              <div className='action-swift-box'>
                <span
                  className='action-swift-text'
                  onClick={() => setAction('REGISTER')}>
                  Don't have an account? click here to register.
                </span>
              </div>
              <span className='login-form-heading-text'>
                Welcome Back!
              </span>
              {loginFormControl && loginFormControl.messageList && loginFormControl.messageList.length !== 0 ?
                <div className="ui error message">
                  <div className="header">Error occurred</div>
                  <p>Please check the following:
                    <ul>
                      {loginFormControl.messageList.map((msg) =>
                        <li>{msg}</li>
                      )}
                    </ul>
                  </p>
                </div> : null}
              <Form className='login-form'>
                <Form.Field
                  error={loginFormControl.usernameEmail}
                  required>
                  <label>Username/Email</label>
                  <Input
                    placeholder='Please input username or email address'
                    onChange={(e) => onChangeLoginUsernameEmail(e)} />
                </Form.Field>
                <Form.Field
                  error={loginFormControl.password}
                  required>
                  <label>Password</label>
                  <Input
                    placeholder='Please input your password'
                    type='password'
                    onChange={(e) => onChangeLoginPassword(e)} />
                  <br />
                  {/*
                  <span className='login-form-forgot-pw'>
                    Forget Password?
                  </span>
                      */}
                </Form.Field>
                <Button
                  className='login-form-submit-btn'
                  type='submit'
                  onClick={() => handleLogin(defaultLoginFormControl)}>
                  Login
                </Button>
              </Form>
              <br />
            </Segment> : null}
        </div>
      </div>
    </div >
  );
}

export default Landing;
