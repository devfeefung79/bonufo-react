import React, { useState } from 'react';
import { RegisterForm, defaultRegisterForm, defaultRegisterFormControl, RegisterFormRequestBody } from '../../../utils/FormUtils';
import { Segment, Button, Checkbox, Form, Input } from 'semantic-ui-react';
import { register, login } from '../../../services/UserService';
import './RegisterForm.css';

function RegisterUserForm(props) {

  const [registerFormData, setRegisterFormData] = useState<RegisterForm>(defaultRegisterForm);
  const [registerFormControl, setRegisterFormControl] = useState(defaultRegisterFormControl);

  const onChangeRegUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, username: e.target.value });
  }

  const onChangeRegEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, email: e.target.value });
  }

  const onChangeRegPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, password: e.target.value });
  }

  const onChangeRegConfirmPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, confirmPassword: e.target.value });
  }

  const onChangeRegRoleLearner = () => {
    setRegisterFormData({
      ...registerFormData, role: {
        learner: true,
        tutor: false,
      }
    });
  }

  const onChangeRegRoleTutor = () => {
    setRegisterFormData({
      ...registerFormData, role: {
        learner: false,
        tutor: true,
      }
    });
  }

  const onChangeRegTerm = () => {
    const nextValue = registerFormData.termCondition === true ? false : true;
    setRegisterFormData({ ...registerFormData, termCondition: nextValue });
  }

  const handleRegister = (formControlDefault) => {
    let isPass = validateRegisterForm(formControlDefault);
    if (isPass) {
      const roleStr = registerFormData.role.learner ? 'Learner' : 'Tutor';
      const requestBody: RegisterFormRequestBody = {
        username: registerFormData.username,
        email: registerFormData.email,
        password: registerFormData.password,
        role: roleStr,
      }
      requestRegister(requestBody, formControlDefault);
    }
  }

  const requestRegister = async (requestBody: RegisterFormRequestBody, formControlDefault) => {
    const registerResponse = await register(requestBody);
    if (registerResponse) {
      if (registerResponse === 'Duplicate user') {
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
      }
      else if (registerResponse === 'Duplicate email') {
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
      else {
        const loginResponse = await login(requestBody);
        if (loginResponse) props.handleSuccessLogin(loginResponse);
      }
    }
  }

  const validateRegisterForm = (formControlDefault): boolean => {
    let checkFormError = { ...formControlDefault };
    checkFormError.messageList = [];
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

  return (
    <Segment className='register-form-segment'>
      <div className='action-swift-box'>
        <span
          className='action-swift-text'
          onClick={() => props.toggleAction('LOGIN')}>
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
              {registerFormControl.messageList.map((mItem, mIndex) =>
                <li key={mIndex}>{mItem}</li>
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
    </Segment>
  );
}

export default RegisterUserForm;
