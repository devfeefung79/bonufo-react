import React, { useState } from 'react';
import axios from 'axios';
import { LoginForm, defaultLoginForm, defaultLoginFormControl, LoginFormRequestBody } from '../../../utils/FormUtils';
import { Segment, Button, Form, Input } from 'semantic-ui-react';
import { login } from '../../../services/UserService';
import './LoginForm.css';

const BASE_URL = `http://localhost:3001`;

function LoginUserForm(props) {

  const [loginFormData, setLoginFormData] = useState<LoginForm>(defaultLoginForm);
  const [loginFormControl, setLoginFormControl] = useState(defaultLoginFormControl);

  const onChangeLoginUsernameEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, usernameEmail: e.target.value });
  }

  const onChangeLoginPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, password: e.target.value });
  }

  const handleLogin = (formControlDefault) => {
    const isPass = validateLoginForm(formControlDefault);
    if (isPass) {
      let requestBody: LoginFormRequestBody = {
        password: loginFormData.password,
      };
      const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (emailRegEx.test(loginFormData.usernameEmail)) {
        requestBody.email = loginFormData.usernameEmail;
      } else {
        requestBody.username = loginFormData.usernameEmail;
      }
      requestLogin(requestBody, formControlDefault);
    }
  }

  const requestLogin = async (requestBody: LoginFormRequestBody, formControlDefault) => {
    const responseData = await login(requestBody);
    if (responseData) {
      if (responseData === 'No user found') {
        setLoginFormControl({
          ...loginFormControl,
          usernameEmail: true,
          password: formControlDefault.password,
          messageList: ['Unable to find the username or email']
        });
      }
      else if (responseData === 'Invalid password') {
        setLoginFormControl({
          ...loginFormControl,
          usernameEmail: true,
          password: formControlDefault.password,
          messageList: ['Invalid password']
        });
      }
      else {
        props.handleSuccessLogin(responseData);
      }
    }
    /*
    axios.post(`${BASE_URL}/user/login`, requestBody, {
      withCredentials: true,
    })
      .then(res => {
        props.handleSuccessLogin(res.data.accessToken);
      })
      .catch((err) => {
        console.log(err.message);
      })
    */
  }

  const validateLoginForm = (formControlDefault): boolean => {
    let checkFormError = { ...formControlDefault };
    checkFormError.messageList = [];
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
    <Segment className='login-form-segment'>
      <div className='action-swift-box'>
        <span
          className='action-swift-text'
          onClick={() => props.toggleAction('REGISTER')}>
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
    </Segment>
  );
}

export default LoginUserForm;
